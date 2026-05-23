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
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
const MAX_FAILURES = 10;
let WebhooksService = WebhooksService_1 = class WebhooksService {
    prisma;
    logger = new common_1.Logger(WebhooksService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(orgId, dto) {
        const secret = (0, crypto_1.randomBytes)(32).toString('hex');
        return this.prisma.webhook.create({
            data: {
                organizationId: orgId,
                name: dto.name,
                url: dto.url,
                secret,
                events: dto.events,
                headers: dto.headers ?? undefined,
            },
        });
    }
    async findAll(orgId) {
        return this.prisma.webhook.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(orgId, id) {
        const webhook = await this.prisma.webhook.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!webhook)
            throw new common_1.NotFoundException('Webhook not found');
        return webhook;
    }
    async update(orgId, id, dto) {
        await this.findOne(orgId, id);
        const extra = dto.isActive === true ? { failureCount: 0 } : {};
        return this.prisma.webhook.update({
            where: { id },
            data: { ...dto, ...extra },
        });
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        return this.prisma.webhook.delete({ where: { id } });
    }
    async deliverEvent(orgId, event, payload) {
        const webhooks = await this.prisma.webhook.findMany({
            where: {
                organizationId: orgId,
                isActive: true,
            },
        });
        const matching = webhooks.filter((wh) => {
            const events = wh.events;
            return events.includes(event) || events.includes('*');
        });
        const results = await Promise.allSettled(matching.map((wh) => this.deliver(wh, event, payload)));
        return results;
    }
    async deliver(webhook, event, payload) {
        const body = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
        const signature = (0, crypto_1.createHmac)('sha256', webhook.secret)
            .update(body)
            .digest('hex');
        const customHeaders = webhook.headers ?? {};
        const start = Date.now();
        let responseStatus = null;
        let responseBody = null;
        let success = false;
        try {
            const res = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Signature': signature,
                    'X-Webhook-Event': event,
                    ...customHeaders,
                },
                body,
                signal: AbortSignal.timeout(10_000),
            });
            responseStatus = res.status;
            responseBody = await res.text().catch(() => null);
            success = res.ok;
        }
        catch (err) {
            responseBody = err.message ?? 'Request failed';
            this.logger.warn(`Webhook ${webhook.id} delivery failed: ${err.message}`);
        }
        const executionTimeMs = Date.now() - start;
        await this.prisma.webhookLog.create({
            data: {
                webhookId: webhook.id,
                event,
                payload: { event, payload },
                responseStatus,
                responseBody,
                success,
                executionTimeMs,
            },
        });
        if (success) {
            await this.prisma.webhook.update({
                where: { id: webhook.id },
                data: {
                    lastTriggeredAt: new Date(),
                    failureCount: 0,
                },
            });
        }
        else {
            const newCount = webhook.failureCount + 1;
            await this.prisma.webhook.update({
                where: { id: webhook.id },
                data: {
                    lastTriggeredAt: new Date(),
                    failureCount: newCount,
                    ...(newCount >= MAX_FAILURES ? { isActive: false } : {}),
                },
            });
            if (newCount >= MAX_FAILURES) {
                this.logger.warn(`Webhook ${webhook.id} auto-disabled after ${MAX_FAILURES} consecutive failures`);
            }
        }
    }
    async testWebhook(orgId, webhookId) {
        const webhook = await this.findOne(orgId, webhookId);
        await this.deliver(webhook, 'webhook.test', { message: 'Test ping from CRM', webhookId });
        return { message: 'Test event sent' };
    }
    async getLogsForWebhook(webhookId, limit = 20) {
        return this.prisma.webhookLog.findMany({
            where: { webhookId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map