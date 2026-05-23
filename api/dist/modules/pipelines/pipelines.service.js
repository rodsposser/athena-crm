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
exports.PipelinesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const DEFAULT_STATUSES = [
    { name: 'Novo', color: '#6B7280', isDefault: true, position: 0 },
    { name: 'Em contato', color: '#3B82F6', position: 1 },
    { name: 'Qualificado', color: '#8B5CF6', isMql: true, position: 2 },
    { name: 'Reunião agendada', color: '#F59E0B', isMeeting: true, position: 3 },
    { name: 'Ganho', color: '#10B981', isFinal: true, isWon: true, position: 4 },
    { name: 'Perdido', color: '#EF4444', isFinal: true, isWon: false, position: 5 },
];
let PipelinesService = class PipelinesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(orgId, dto) {
        const count = await this.prisma.pipeline.count({
            where: { organizationId: orgId, deletedAt: null },
        });
        return this.prisma.pipeline.create({
            data: {
                organizationId: orgId,
                name: dto.name,
                description: dto.description,
                position: count,
                statuses: {
                    create: DEFAULT_STATUSES,
                },
            },
            include: { statuses: { orderBy: { position: 'asc' } } },
        });
    }
    async findAll(orgId) {
        return this.prisma.pipeline.findMany({
            where: { organizationId: orgId, deletedAt: null },
            include: {
                statuses: { orderBy: { position: 'asc' } },
                _count: { select: { statuses: true } },
            },
            orderBy: { position: 'asc' },
        });
    }
    async findOne(orgId, id) {
        const pipeline = await this.prisma.pipeline.findFirst({
            where: { id, organizationId: orgId, deletedAt: null },
            include: {
                statuses: { orderBy: { position: 'asc' } },
                transitionRules: true,
            },
        });
        if (!pipeline)
            throw new common_1.NotFoundException('Pipeline not found');
        return pipeline;
    }
    async update(orgId, id, dto) {
        await this.findOne(orgId, id);
        return this.prisma.pipeline.update({
            where: { id },
            data: dto,
            include: { statuses: { orderBy: { position: 'asc' } } },
        });
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        return this.prisma.pipeline.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async createStatus(orgId, pipelineId, dto) {
        const pipeline = await this.findOne(orgId, pipelineId);
        const maxPosition = pipeline.statuses.length;
        return this.prisma.pipelineStatus.create({
            data: {
                pipelineId,
                name: dto.name,
                color: dto.color || '#6B7280',
                position: maxPosition,
                isFinal: dto.isFinal || false,
                isWon: dto.isWon || false,
                isMql: dto.isMql || false,
                isMeeting: dto.isMeeting || false,
                staleAfterDays: dto.staleAfterDays,
            },
        });
    }
    async updateStatus(orgId, statusId, dto) {
        const status = await this.prisma.pipelineStatus.findUnique({
            where: { id: statusId },
            include: { pipeline: true },
        });
        if (!status || status.pipeline.organizationId !== orgId) {
            throw new common_1.NotFoundException('Status not found');
        }
        if (dto.isDefault) {
            await this.prisma.pipelineStatus.updateMany({
                where: { pipelineId: status.pipelineId, isDefault: true },
                data: { isDefault: false },
            });
        }
        return this.prisma.pipelineStatus.update({
            where: { id: statusId },
            data: dto,
        });
    }
    async deleteStatus(orgId, statusId) {
        const status = await this.prisma.pipelineStatus.findUnique({
            where: { id: statusId },
            include: { pipeline: true },
        });
        if (!status || status.pipeline.organizationId !== orgId) {
            throw new common_1.NotFoundException('Status not found');
        }
        if (status.isDefault) {
            throw new common_1.BadRequestException('Cannot delete the default status. Set another as default first.');
        }
        const count = await this.prisma.pipelineStatus.count({
            where: { pipelineId: status.pipelineId },
        });
        if (count <= 1) {
            throw new common_1.BadRequestException('Pipeline must have at least one status');
        }
        return this.prisma.pipelineStatus.delete({ where: { id: statusId } });
    }
    async reorderStatuses(orgId, pipelineId, dto) {
        await this.findOne(orgId, pipelineId);
        const updates = dto.statusIds.map((id, index) => this.prisma.pipelineStatus.update({
            where: { id },
            data: { position: index },
        }));
        await this.prisma.$transaction(updates);
        return this.prisma.pipelineStatus.findMany({
            where: { pipelineId },
            orderBy: { position: 'asc' },
        });
    }
    async createTransitionRule(orgId, pipelineId, dto) {
        await this.findOne(orgId, pipelineId);
        const existing = await this.prisma.transitionRule.findUnique({
            where: {
                pipelineId_fromStatusId_toStatusId: {
                    pipelineId,
                    fromStatusId: dto.fromStatusId,
                    toStatusId: dto.toStatusId,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Transition rule already exists');
        }
        return this.prisma.transitionRule.create({
            data: {
                pipelineId,
                fromStatusId: dto.fromStatusId,
                toStatusId: dto.toStatusId,
                isAllowed: dto.isAllowed ?? true,
                requiredFields: dto.requiredFields || [],
            },
        });
    }
    async getTransitionRules(orgId, pipelineId) {
        await this.findOne(orgId, pipelineId);
        return this.prisma.transitionRule.findMany({
            where: { pipelineId },
            include: { fromStatus: true, toStatus: true },
        });
    }
    async deleteTransitionRule(orgId, ruleId) {
        const rule = await this.prisma.transitionRule.findUnique({
            where: { id: ruleId },
            include: { pipeline: true },
        });
        if (!rule || rule.pipeline.organizationId !== orgId) {
            throw new common_1.NotFoundException('Transition rule not found');
        }
        return this.prisma.transitionRule.delete({ where: { id: ruleId } });
    }
};
exports.PipelinesService = PipelinesService;
exports.PipelinesService = PipelinesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PipelinesService);
//# sourceMappingURL=pipelines.service.js.map