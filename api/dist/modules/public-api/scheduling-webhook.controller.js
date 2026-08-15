"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingWebhookController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const PIPELINE_ID = 'cmsqki0uc000c4g37fmvlfpr3';
const TARGET_STATUS_NAME = 'Reunião Agendada';
const N8N_NOTIFY_URL = 'https://abelerosa-n8n.ujnljw.easypanel.host/webhook/athena-reuniao-agendada';
let SchedulingWebhookController = class SchedulingWebhookController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handle(payload) {
        await this.prisma
            .$executeRawUnsafe(`INSERT INTO webhook_debug_captures (headers, body, query) VALUES ('{}'::jsonb, $1::jsonb, '{}'::jsonb)`, JSON.stringify(payload ?? {}))
            .catch(() => { });
        const booking = payload?.booking;
        if (!booking?.id || !booking?.name) {
            throw new common_1.BadRequestException('Payload sem booking.id/booking.name');
        }
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
            throw new common_1.BadRequestException('Configuração de organização/pipeline não encontrada');
        }
        const source = (booking.utm_source &&
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
            let contactId;
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
                        name: booking.name,
                        email: booking.email,
                        phone: booking.phone,
                    },
                });
                contactId = created.id;
            }
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
                        title: booking.name,
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
            await tx.note.create({
                data: {
                    leadId: lead.id,
                    userId: owner.id,
                    content: `Reunião agendada automaticamente via webhook (booking ${booking.id}).`,
                    isPinned: false,
                },
            });
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
        }
        catch (err) {
            console.error('[scheduling-webhook] falha ao avisar Closer no WhatsApp', err);
        }
        return { ok: true, leadId: result.id };
    }
};
exports.SchedulingWebhookController = SchedulingWebhookController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulingWebhookController.prototype, "handle", null);
exports.SchedulingWebhookController = SchedulingWebhookController = __decorate([
    (0, common_1.Controller)('public/v1/webhooks/scheduling'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchedulingWebhookController);
//# sourceMappingURL=scheduling-webhook.controller.js.map