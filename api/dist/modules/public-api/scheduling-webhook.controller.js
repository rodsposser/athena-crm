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
        const result = await this.prisma.$transaction(async (tx) => {
            let contactId;
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
                        name: booking.name,
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
                    title: booking.name,
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