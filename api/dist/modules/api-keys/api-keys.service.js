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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeysService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
let ApiKeysService = class ApiKeysService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    hashKey(key) {
        return (0, crypto_1.createHash)('sha256').update(key).digest('hex');
    }
    async create(orgId, userId, dto) {
        const rawKey = (0, crypto_1.randomBytes)(32).toString('hex');
        const prefix = rawKey.slice(0, 8);
        const keyHash = this.hashKey(rawKey);
        const apiKey = await this.prisma.apiKey.create({
            data: {
                organizationId: orgId,
                createdBy: userId,
                name: dto.name,
                keyHash,
                prefix,
                scopes: dto.scopes ?? ['leads:write'],
            },
        });
        return {
            id: apiKey.id,
            name: apiKey.name,
            key: rawKey,
            prefix,
            scopes: apiKey.scopes,
            createdAt: apiKey.createdAt,
        };
    }
    async findAll(orgId) {
        return this.prisma.apiKey.findMany({
            where: { organizationId: orgId },
            select: {
                id: true,
                name: true,
                prefix: true,
                scopes: true,
                isActive: true,
                lastUsedAt: true,
                expiresAt: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async revoke(orgId, id) {
        return this.prisma.apiKey.update({
            where: { id, organizationId: orgId },
            data: { isActive: false },
        });
    }
    async validateKey(rawKey) {
        const keyHash = this.hashKey(rawKey);
        const apiKey = await this.prisma.apiKey.findUnique({
            where: { keyHash },
        });
        if (!apiKey)
            return null;
        if (!apiKey.isActive)
            return null;
        if (apiKey.expiresAt && apiKey.expiresAt < new Date())
            return null;
        this.prisma.apiKey
            .update({
            where: { id: apiKey.id },
            data: { lastUsedAt: new Date() },
        })
            .catch(() => { });
        return apiKey;
    }
};
exports.ApiKeysService = ApiKeysService;
exports.ApiKeysService = ApiKeysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApiKeysService);
//# sourceMappingURL=api-keys.service.js.map