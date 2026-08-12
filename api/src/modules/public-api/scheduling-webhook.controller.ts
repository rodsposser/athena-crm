import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../../common/decorators/public.decorator';

// Recebe o webhook "booking.created" da ferramenta de agendamento da
// mentoria — a ferramenta só oferece um campo de URL crua (sem header/body
// customizável), então esse endpoint fica sem autenticação por header e usa
// o próprio formato fixo dela. Formato confirmado via captura real em
// 2026-08-12 (ver webhook-debug.controller.ts).
//
// Sempre associado ao pipeline "Advocacia" (é o funil de captação de
// clientes da própria Athena) e sempre cai direto na etapa "Reunião
// Agendada" — o lead já chega qualificado (passou pelo formulário + marcou
// horário), não faz sentido nascer em "Lead Recebido".
const PIPELINE_ID = 'cmsqki0uc000c4g37fmvlfpr3';
const TARGET_STATUS_NAME = 'Reunião Agendada';

interface BookingPayload {
  event?: string;
  booking?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    notes?: string | null;
    scheduled_at?: string;
    scheduled_end_at?: string;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
  };
}

@Controller('public/v1/webhooks/scheduling')
@Public()
export class SchedulingWebhookController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(@Body() payload: BookingPayload) {
    // Loga sempre, mesmo em caso de erro depois — não deixa a gente cego de
    // novo se o formato mudar (mesmo erro que gastamos essa sessão inteira
    // resolvendo no InitiateCheckout do UTM Tracker).
    await this.prisma
      .$executeRawUnsafe(
        `INSERT INTO webhook_debug_captures (headers, body, query) VALUES ('{}'::jsonb, $1::jsonb, '{}'::jsonb)`,
        JSON.stringify(payload ?? {}),
      )
      .catch(() => {});

    const booking = payload?.booking;
    if (!booking?.id || !booking?.name) {
      throw new BadRequestException('Payload sem booking.id/booking.name');
    }

    // Idempotência: se esse booking.id já foi processado (reenvio do
    // webhook), não duplica o lead.
    const existingNote = await this.prisma.note.findFirst({
      where: { content: { contains: booking.id } },
    });
    if (existingNote) {
      return { ok: true, deduped: true };
    }

    const org = await this.prisma.organization.findUnique({
      where: { slug: 'athena-assessoria' },
    });
    const owner = await this.prisma.user.findUnique({
      where: { email: 'rodrigopossercarvalho@gmail.com' },
    });
    const status = await this.prisma.pipelineStatus.findFirst({
      where: { pipelineId: PIPELINE_ID, name: { equals: TARGET_STATUS_NAME, mode: 'insensitive' } },
    });
    if (!org || !owner || !status) {
      throw new BadRequestException('Configuração de organização/pipeline não encontrada');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      let contactId: string | undefined;
      if (booking.email) {
        const existing = await tx.contact.findFirst({
          where: { organizationId: org.id, email: booking.email },
        });
        contactId = existing?.id;
      }
      if (!contactId) {
        const created = await tx.contact.create({
          data: {
            organizationId: org.id,
            name: booking.name!,
            email: booking.email,
            phone: booking.phone,
          },
        });
        contactId = created.id;
      }

      const maxPos = await tx.lead.aggregate({
        where: { statusId: status.id, deletedAt: null },
        _max: { position: true },
      });

      const lead = await tx.lead.create({
        data: {
          organizationId: org.id,
          pipelineId: PIPELINE_ID,
          statusId: status.id,
          title: booking.name!,
          contactId,
          position: (maxPos._max.position ?? -1) + 1,
          temperature: 'HOT',
        },
      });

      if (booking.utm_source || booking.utm_medium || booking.utm_campaign) {
        await tx.leadTracking.create({
          data: {
            leadId: lead.id,
            utmSource: booking.utm_source ?? undefined,
            utmMedium: booking.utm_medium ?? undefined,
            utmCampaign: booking.utm_campaign ?? undefined,
          },
        });
      }

      const scheduled = booking.scheduled_at
        ? new Date(booking.scheduled_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        : 'horário não informado';

      await tx.note.create({
        data: {
          leadId: lead.id,
          userId: owner.id,
          content: `Reunião agendada automaticamente via webhook (booking ${booking.id}) para ${scheduled}.${booking.notes ? `\nObservações do lead: ${booking.notes}` : ''}`,
          isPinned: true,
        },
      });

      return lead;
    });

    return { ok: true, leadId: result.id };
  }
}
