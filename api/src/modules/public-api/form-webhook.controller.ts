import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../../common/decorators/public.decorator';

// Recebe o webhook "form_submitted" do ChronosDock (formulário de
// qualificação, antes do agendamento) — mesma ideia do scheduling-webhook,
// URL crua sem header customizável. Formato confirmado via captura real em
// 2026-08-15.
//
// Cai em "Lead Recebido" (etapa padrão do pipeline), sem tarefa — ainda não
// tem reunião marcada. Se essa mesma pessoa agendar depois, o
// scheduling-webhook encontra esse lead (por telefone/e-mail) e move pra
// "Reunião Agendada" em vez de duplicar.
const PIPELINE_ID = 'cmsqki0uc000c4g37fmvlfpr3';

// Avisa o Closer no WhatsApp assim que o formulário é respondido (antes até
// de agendar) — workflow separado do de reunião agendada, mensagem e n8n
// endpoint próprios. Só-melhor-esforço, nunca derruba a criação do lead.
const N8N_NOTIFY_URL = 'https://abelerosa-n8n.ujnljw.easypanel.host/webhook/athena-formulario-respondido';

interface FormPayload {
  event?: string;
  lead?: {
    id?: string;
    name?: string;
    email?: string | null;
    phone?: string | null;
  };
  tracking?: {
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
  };
  answers_map?: Record<string, string>;
}

@Controller('public/v1/webhooks/form')
@Public()
export class FormWebhookController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(@Body() payload: FormPayload) {
    await this.prisma
      .$executeRawUnsafe(
        `INSERT INTO webhook_debug_captures (headers, body, query) VALUES ('{}'::jsonb, $1::jsonb, '{}'::jsonb)`,
        JSON.stringify(payload ?? {}),
      )
      .catch(() => {});

    const lead = payload?.lead;
    if (!lead?.id || !lead?.name) {
      throw new BadRequestException('Payload sem lead.id/lead.name');
    }

    const existingNote = await this.prisma.note.findFirst({
      where: { content: { contains: lead.id } },
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
      where: { pipelineId: PIPELINE_ID, isDefault: true },
    });
    if (!org || !owner || !status) {
      throw new BadRequestException('Configuração de organização/pipeline não encontrada');
    }

    const utmSource = payload?.tracking?.utm_source;
    const source =
      (utmSource &&
        (await this.prisma.leadSource.findFirst({
          where: { organizationId: org.id, name: { contains: utmSource, mode: 'insensitive' } },
        }))) ||
      (await this.prisma.leadSource.findFirst({
        where: { organizationId: org.id, name: { equals: 'Meta Ads', mode: 'insensitive' } },
      }));

    const answers = payload?.answers_map;
    const answersText = answers
      ? Object.entries(answers)
          .map(([q, a]) => `- ${q.replace(/<[^>]+>/g, '')}: ${a}`)
          .join('\n')
      : '';

    const result = await this.prisma.$transaction(async (tx) => {
      let contactId: string | undefined;

      if (lead.phone) {
        const existing = await tx.contact.findFirst({
          where: { organizationId: org.id, phone: lead.phone },
        });
        contactId = existing?.id;
      }
      if (!contactId && lead.email) {
        const existing = await tx.contact.findFirst({
          where: { organizationId: org.id, email: lead.email },
        });
        contactId = existing?.id;
      }
      if (!contactId) {
        const created = await tx.contact.create({
          data: {
            organizationId: org.id,
            name: lead.name!,
            email: lead.email ?? undefined,
            phone: lead.phone ?? undefined,
          },
        });
        contactId = created.id;
      }

      const maxPos = await tx.lead.aggregate({
        where: { statusId: status.id, deletedAt: null },
        _max: { position: true },
      });

      const createdLead = await tx.lead.create({
        data: {
          organizationId: org.id,
          pipelineId: PIPELINE_ID,
          statusId: status.id,
          title: lead.name!,
          contactId,
          sourceId: source?.id,
          position: (maxPos._max.position ?? -1) + 1,
          temperature: 'WARM',
        },
      });

      const tracking = payload?.tracking;
      if (tracking?.utm_source || tracking?.utm_medium || tracking?.utm_campaign) {
        await tx.leadTracking.create({
          data: {
            leadId: createdLead.id,
            utmSource: tracking.utm_source ?? undefined,
            utmMedium: tracking.utm_medium ?? undefined,
            utmCampaign: tracking.utm_campaign ?? undefined,
          },
        });
      }

      await tx.note.create({
        data: {
          leadId: createdLead.id,
          userId: owner.id,
          content: `Formulário respondido automaticamente via webhook (lead ${lead.id}).${answersText ? `\n\nRespostas:\n${answersText}` : ''}`,
          isPinned: false,
        },
      });

      return createdLead;
    });

    try {
      await fetch(N8N_NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          phone: lead.phone ?? '',
          answers: answersText || 'Sem respostas registradas.',
        }),
      });
    } catch (err) {
      console.error('[form-webhook] falha ao avisar Closer no WhatsApp', err);
    }

    return { ok: true, leadId: result.id };
  }
}
