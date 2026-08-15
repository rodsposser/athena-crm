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

// Avisa o Closer no WhatsApp (via n8n → Evolution API) quando uma reunião é
// agendada. Falha nesse aviso nunca deve derrubar a criação do lead — é
// só-melhor-esforço, por isso fica isolado e sempre dentro de um try/catch.
const N8N_NOTIFY_URL = 'https://abelerosa-n8n.ujnljw.easypanel.host/webhook/athena-reuniao-agendada';

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

    // Origem do lead: tenta casar com o utm_source recebido; sem isso, cai em
    // "Meta Ads" (essa integração inteira existe pra campanha de Meta Ads).
    const source =
      (booking.utm_source &&
        (await this.prisma.leadSource.findFirst({
          where: { organizationId: org.id, name: { contains: booking.utm_source, mode: 'insensitive' } },
        }))) ||
      (await this.prisma.leadSource.findFirst({
        where: { organizationId: org.id, name: { equals: 'Meta Ads', mode: 'insensitive' } },
      }));

    const scheduled = booking.scheduled_at
      ? new Date(booking.scheduled_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      : 'horário não informado';

    const result = await this.prisma.$transaction(async (tx) => {
      let contactId: string | undefined;
      if (booking.phone) {
        const existing = await tx.contact.findFirst({
          where: { organizationId: org.id, phone: booking.phone },
        });
        contactId = existing?.id;
      }
      if (!contactId && booking.email) {
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

      // Se essa pessoa já preencheu o formulário antes (form-webhook.controller.ts
      // criou um lead em "Lead Recebido"), reaproveita esse lead em vez de
      // duplicar — só move pra "Reunião Agendada" e atualiza o que faltava.
      const existingLead = await tx.lead.findFirst({
        where: { organizationId: org.id, pipelineId: PIPELINE_ID, contactId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
      });

      const lead = existingLead
        ? await tx.lead.update({
            where: { id: existingLead.id },
            data: {
              statusId: status.id,
              temperature: 'HOT',
              sourceId: existingLead.sourceId ?? source?.id,
              lastStatusChangedAt: new Date(),
            },
          })
        : await tx.lead.create({
            data: {
              organizationId: org.id,
              pipelineId: PIPELINE_ID,
              statusId: status.id,
              title: booking.name!,
              contactId,
              sourceId: source?.id,
              position: ((await tx.lead.aggregate({
                where: { statusId: status.id, deletedAt: null },
                _max: { position: true },
              }))._max.position ?? -1) + 1,
              temperature: 'HOT',
            },
          });

      if (!existingLead && (booking.utm_source || booking.utm_medium || booking.utm_campaign)) {
        await tx.leadTracking.create({
          data: {
            leadId: lead.id,
            utmSource: booking.utm_source ?? undefined,
            utmMedium: booking.utm_medium ?? undefined,
            utmCampaign: booking.utm_campaign ?? undefined,
          },
        });
      }

      // Nota curta pra rastreabilidade (também serve de marca de idempotência,
      // ver checagem de dedupe acima).
      await tx.note.create({
        data: {
          leadId: lead.id,
          userId: owner.id,
          content: `Reunião agendada automaticamente via webhook (booking ${booking.id}).`,
          isPinned: false,
        },
      });

      // Tarefa de verdade, aparece no calendário da aba Planning — é o que
      // realmente avisa o Closer do horário marcado.
      if (booking.scheduled_at) {
        await tx.scheduledTask.create({
          data: {
            organizationId: org.id,
            leadId: lead.id,
            createdById: owner.id,
            type: 'MEETING',
            scheduledAt: new Date(booking.scheduled_at),
            notes: booking.notes ?? `Reunião agendada via formulário — ${scheduled}.`,
          },
        });
      }

      return lead;
    });

    try {
      await fetch(N8N_NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: booking.name,
          email: booking.email ?? '',
          phone: booking.phone ?? '',
          scheduled_at: scheduled,
          notes: booking.notes ?? '',
        }),
      });
    } catch (err) {
      console.error('[scheduling-webhook] falha ao avisar Closer no WhatsApp', err);
    }

    return { ok: true, leadId: result.id };
  }
}
