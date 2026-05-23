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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LeadsService = class LeadsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(orgId, userId, dto) {
        let targetStatusId;
        if (dto.statusId) {
            const status = await this.prisma.pipelineStatus.findFirst({
                where: { id: dto.statusId, pipelineId: dto.pipelineId },
            });
            if (!status) {
                throw new common_1.BadRequestException('Status not found in this pipeline');
            }
            targetStatusId = status.id;
        }
        else {
            const defaultStatus = await this.prisma.pipelineStatus.findFirst({
                where: { pipelineId: dto.pipelineId, isDefault: true },
            });
            if (!defaultStatus) {
                throw new common_1.BadRequestException('Pipeline has no default status');
            }
            targetStatusId = defaultStatus.id;
        }
        const maxPos = await this.prisma.lead.aggregate({
            where: { statusId: targetStatusId, deletedAt: null },
            _max: { position: true },
        });
        const position = (maxPos._max.position ?? -1) + 1;
        let contactId;
        let companyId;
        if (dto.companyName) {
            const company = await this.prisma.company.upsert({
                where: {
                    id: 'new',
                },
                update: {},
                create: {
                    organizationId: orgId,
                    name: dto.companyName,
                },
            }).catch(async () => {
                const existing = await this.prisma.company.findFirst({
                    where: { organizationId: orgId, name: dto.companyName },
                });
                if (existing)
                    return existing;
                return this.prisma.company.create({
                    data: { organizationId: orgId, name: dto.companyName },
                });
            });
            companyId = company.id;
        }
        if (dto.contactName || dto.contactEmail) {
            let contact = dto.contactEmail
                ? await this.prisma.contact.findFirst({
                    where: { organizationId: orgId, email: dto.contactEmail },
                })
                : null;
            if (!contact) {
                contact = await this.prisma.contact.create({
                    data: {
                        organizationId: orgId,
                        name: dto.contactName || dto.contactEmail || 'Sem nome',
                        email: dto.contactEmail,
                        phone: dto.contactPhone,
                        companyId,
                    },
                });
            }
            contactId = contact.id;
        }
        return this.prisma.lead.create({
            data: {
                organizationId: orgId,
                pipelineId: dto.pipelineId,
                statusId: targetStatusId,
                title: dto.title,
                estimatedValue: dto.estimatedValue || 0,
                priority: dto.priority || 'MEDIUM',
                temperature: dto.temperature || 'WARM',
                assigneeId: dto.assigneeId,
                contactId,
                companyId,
                position,
            },
            include: {
                status: true,
                assignee: { select: { id: true, name: true, email: true } },
                contact: true,
                company: true,
            },
        });
    }
    async findByPipeline(orgId, pipelineId, filters) {
        const where = {
            organizationId: orgId,
            pipelineId,
            deletedAt: null,
        };
        if (filters?.statusId)
            where.statusId = filters.statusId;
        if (filters?.assigneeId)
            where.assigneeId = filters.assigneeId;
        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { contact: { name: { contains: filters.search, mode: 'insensitive' } } },
                { contact: { email: { contains: filters.search, mode: 'insensitive' } } },
                { company: { name: { contains: filters.search, mode: 'insensitive' } } },
            ];
        }
        const take = filters?.limit || 500;
        return this.prisma.lead.findMany({
            where,
            include: {
                status: true,
                assignee: { select: { id: true, name: true, avatarUrl: true } },
                contact: { select: { id: true, name: true, email: true, phone: true } },
                company: { select: { id: true, name: true } },
            },
            orderBy: [{ statusId: 'asc' }, { position: 'asc' }],
            take,
            ...(filters?.cursor ? { skip: 1, cursor: { id: filters.cursor } } : {}),
        });
    }
    async findOne(orgId, id) {
        const lead = await this.prisma.lead.findFirst({
            where: { id, organizationId: orgId, deletedAt: null },
            include: {
                status: true,
                pipeline: { select: { id: true, name: true } },
                assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
                contact: true,
                company: true,
                tags: { include: { tag: true } },
            },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        return lead;
    }
    async update(orgId, id, dto) {
        const lead = await this.findOne(orgId, id);
        if (dto.version !== lead.version) {
            throw new common_1.ConflictException('This lead was modified by another user. Please refresh and try again.');
        }
        const { version, expectedCloseDate, ...data } = dto;
        return this.prisma.lead.update({
            where: { id },
            data: {
                ...data,
                ...(expectedCloseDate ? { expectedCloseDate: new Date(expectedCloseDate) } : {}),
                lastActivityAt: new Date(),
                version: { increment: 1 },
            },
            include: {
                status: true,
                assignee: { select: { id: true, name: true, email: true } },
                contact: true,
                company: true,
            },
        });
    }
    async move(orgId, id, dto) {
        const lead = await this.findOne(orgId, id);
        const newStatus = await this.prisma.pipelineStatus.findFirst({
            where: { id: dto.statusId, pipelineId: lead.pipelineId },
        });
        if (!newStatus) {
            throw new common_1.BadRequestException('Status does not belong to this pipeline');
        }
        let position = dto.position;
        if (position === undefined) {
            const maxPos = await this.prisma.lead.aggregate({
                where: { statusId: dto.statusId, deletedAt: null },
                _max: { position: true },
            });
            position = (maxPos._max.position ?? -1) + 1;
        }
        const now = new Date();
        return this.prisma.lead.update({
            where: { id },
            data: {
                statusId: dto.statusId,
                position,
                lastActivityAt: now,
                lastStatusChangedAt: now,
                version: { increment: 1 },
                ...(newStatus.isFinal && newStatus.isWon ? { wonAt: now } : {}),
                ...(newStatus.isFinal && !newStatus.isWon ? { lostAt: now } : {}),
            },
            include: {
                status: true,
                assignee: { select: { id: true, name: true } },
                contact: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } },
            },
        });
    }
    async assign(orgId, id, dto) {
        await this.findOne(orgId, id);
        return this.prisma.lead.update({
            where: { id },
            data: {
                assigneeId: dto.assigneeId,
                lastActivityAt: new Date(),
                version: { increment: 1 },
            },
            include: {
                status: true,
                assignee: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        return this.prisma.lead.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async bulkMove(orgId, dto) {
        return this.prisma.lead.updateMany({
            where: { id: { in: dto.leadIds }, organizationId: orgId, deletedAt: null },
            data: {
                statusId: dto.statusId,
                lastActivityAt: new Date(),
                lastStatusChangedAt: new Date(),
            },
        });
    }
    async bulkAssign(orgId, dto) {
        return this.prisma.lead.updateMany({
            where: { id: { in: dto.leadIds }, organizationId: orgId, deletedAt: null },
            data: {
                assigneeId: dto.assigneeId,
                lastActivityAt: new Date(),
            },
        });
    }
    async bulkDelete(orgId, dto) {
        return this.prisma.lead.updateMany({
            where: { id: { in: dto.leadIds }, organizationId: orgId, deletedAt: null },
            data: { deletedAt: new Date() },
        });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map