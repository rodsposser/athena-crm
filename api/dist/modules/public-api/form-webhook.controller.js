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
exports.FormWebhookController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const PIPELINE_ID = 'cmsqki0uc000c4g37fmvlfpr3';
let FormWebhookController = class FormWebhookController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handle(payload) {
        await this.prisma
            .$executeRawUnsafe(`INSERT INTO webhook_debug_captures (headers, body, query) VALUES ('{}'::jsonb, $1::jsonb, '{}'::jsonb)`, JSON.stringify(payload ?? {}))
            .catch(() => { });
        const lead = payload?.lead;
        if (!lead?.id || !lead?.name) {
            throw new common_1.BadRequestException('Payload sem lead.id/lead.name');
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
            throw new common_1.BadRequestException('Configuração de organização/pipeline não encontrada');
        }
        const utmSource = payload?.tracking?.utm_source;
        const source = (utmSource &&
            (await this.prisma.leadSource.findFirst({
                where: { organizationId: org.id, name: { contains: utmSource, mode: 'insensitive' } },
            }))) ||
            (await this.prisma.leadSource.findFirst({
                where: { organizationId: org.id, name: { equals: 'Meta Ads', mode: 'insensitive' } },
            }));
        const result = await this.prisma.$transaction(async (tx) => {
            let contactId;
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
                        name: lead.name,
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
                    title: lead.name,
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
            const answers = payload?.answers_map;
            const answersText = answers
                ? Object.entries(answers)
                    .map(([q, a]) => `- ${q.replace(/<[^>]+>/g, '')}: ${a}`)
                    .join('\n')
                : '';
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
        return { ok: true, leadId: result.id };
    }
};
exports.FormWebhookController = FormWebhookController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormWebhookController.prototype, "handle", null);
exports.FormWebhookController = FormWebhookController = __decorate([
    (0, common_1.Controller)('public/v1/webhooks/form'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FormWebhookController);
//# sourceMappingURL=form-webhook.controller.js.map