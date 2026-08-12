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
exports.WebhookDebugController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let WebhookDebugController = class WebhookDebugController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async capture(body, headers, query) {
        await this.prisma.$executeRawUnsafe(`INSERT INTO webhook_debug_captures (headers, body, query) VALUES ($1::jsonb, $2::jsonb, $3::jsonb)`, JSON.stringify(headers ?? {}), JSON.stringify(body ?? {}), JSON.stringify(query ?? {}));
        return { ok: true };
    }
    async verify(query, req) {
        await this.prisma.$executeRawUnsafe(`INSERT INTO webhook_debug_captures (headers, body, query) VALUES ($1::jsonb, $2::jsonb, $3::jsonb)`, JSON.stringify(req.headers ?? {}), JSON.stringify({ note: 'GET verification ping' }), JSON.stringify(query ?? {}));
        return { ok: true };
    }
};
exports.WebhookDebugController = WebhookDebugController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WebhookDebugController.prototype, "capture", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebhookDebugController.prototype, "verify", null);
exports.WebhookDebugController = WebhookDebugController = __decorate([
    (0, common_1.Controller)('public/v1/webhooks/capture'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhookDebugController);
//# sourceMappingURL=webhook-debug.controller.js.map