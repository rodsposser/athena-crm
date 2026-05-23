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
exports.LeadSourcesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LeadSourcesService = class LeadSourcesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId) {
        return this.prisma.leadSource.findMany({
            where: { organizationId: orgId, isActive: true },
            orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        });
    }
    async create(orgId, dto) {
        if (dto.isDefault) {
            await this.prisma.leadSource.updateMany({
                where: { organizationId: orgId, isDefault: true },
                data: { isDefault: false },
            });
        }
        return this.prisma.leadSource.create({
            data: {
                organizationId: orgId,
                name: dto.name,
                type: dto.type,
                color: dto.color,
                icon: dto.icon,
                isDefault: dto.isDefault ?? false,
            },
        });
    }
    async update(orgId, id, dto) {
        const source = await this.prisma.leadSource.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!source)
            throw new common_1.NotFoundException('Lead source not found');
        if (dto.isDefault) {
            await this.prisma.leadSource.updateMany({
                where: { organizationId: orgId, isDefault: true },
                data: { isDefault: false },
            });
        }
        return this.prisma.leadSource.update({
            where: { id },
            data: dto,
        });
    }
    async remove(orgId, id) {
        const source = await this.prisma.leadSource.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!source)
            throw new common_1.NotFoundException('Lead source not found');
        return this.prisma.leadSource.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async report(orgId) {
        const results = await this.prisma.lead.groupBy({
            by: ['sourceId'],
            where: {
                organizationId: orgId,
                deletedAt: null,
                sourceId: { not: null },
            },
            _count: { id: true },
            _sum: { estimatedValue: true },
        });
        const sourceIds = results
            .map((r) => r.sourceId)
            .filter((id) => id !== null);
        const sources = await this.prisma.leadSource.findMany({
            where: { id: { in: sourceIds } },
        });
        const sourceMap = new Map(sources.map((s) => [s.id, s]));
        return results.map((r) => ({
            source: sourceMap.get(r.sourceId) ?? null,
            leadsCount: r._count.id,
            totalEstimatedValue: r._sum.estimatedValue ?? 0,
        }));
    }
};
exports.LeadSourcesService = LeadSourcesService;
exports.LeadSourcesService = LeadSourcesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadSourcesService);
//# sourceMappingURL=lead-sources.service.js.map