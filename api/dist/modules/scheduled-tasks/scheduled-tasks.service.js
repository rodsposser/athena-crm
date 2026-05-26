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
exports.ScheduledTasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ScheduledTasksService = class ScheduledTasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    include = {
        lead: {
            include: {
                contact: { select: { id: true, name: true, phone: true } },
                company: { select: { id: true, name: true } },
                status: { select: { id: true, name: true, color: true } },
                pipeline: { select: { id: true, name: true } },
            },
        },
        createdBy: { select: { id: true, name: true } },
        movedToStatus: { select: { id: true, name: true, color: true } },
    };
    async findByPeriod(orgId, dateFrom, dateTo) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        return this.prisma.scheduledTask.findMany({
            where: {
                organizationId: orgId,
                scheduledAt: { gte: from, lte: to },
            },
            include: this.include,
            orderBy: { scheduledAt: 'asc' },
        });
    }
    async findMetrics(orgId, date) {
        const day = new Date(date);
        day.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        const [callsToday, meetingsToday, completedToday] = await Promise.all([
            this.prisma.scheduledTask.count({
                where: {
                    organizationId: orgId,
                    scheduledAt: { gte: day, lte: dayEnd },
                    type: 'CALL',
                    status: 'COMPLETED',
                },
            }),
            this.prisma.scheduledTask.count({
                where: {
                    organizationId: orgId,
                    scheduledAt: { gte: day, lte: dayEnd },
                    type: 'MEETING',
                    status: 'COMPLETED',
                },
            }),
            this.prisma.scheduledTask.count({
                where: {
                    organizationId: orgId,
                    scheduledAt: { gte: day, lte: dayEnd },
                    status: 'COMPLETED',
                },
            }),
        ]);
        return { callsToday, meetingsToday, completedToday };
    }
    async create(orgId, userId, dto) {
        return this.prisma.scheduledTask.create({
            data: {
                organizationId: orgId,
                leadId: dto.leadId,
                createdById: userId,
                type: dto.type,
                scheduledAt: new Date(dto.scheduledAt),
                notes: dto.notes,
            },
            include: this.include,
        });
    }
    async complete(orgId, id, dto) {
        const task = await this.prisma.scheduledTask.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const updated = await this.prisma.scheduledTask.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                outcome: dto.outcome,
                movedToStatusId: dto.movedToStatusId,
            },
            include: this.include,
        });
        if (dto.movedToStatusId) {
            await this.prisma.lead.update({
                where: { id: task.leadId },
                data: {
                    statusId: dto.movedToStatusId,
                    lastStatusChangedAt: new Date(),
                    lastActivityAt: new Date(),
                },
            });
        }
        return updated;
    }
    async cancel(orgId, id) {
        const task = await this.prisma.scheduledTask.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return this.prisma.scheduledTask.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: this.include,
        });
    }
    async remove(orgId, id) {
        const task = await this.prisma.scheduledTask.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return this.prisma.scheduledTask.delete({ where: { id } });
    }
    async searchLeads(orgId, query) {
        return this.prisma.lead.findMany({
            where: {
                organizationId: orgId,
                deletedAt: null,
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { contact: { name: { contains: query, mode: 'insensitive' } } },
                    { company: { name: { contains: query, mode: 'insensitive' } } },
                ],
            },
            include: {
                contact: { select: { id: true, name: true, phone: true } },
                company: { select: { id: true, name: true } },
                status: { select: { id: true, name: true, color: true } },
                pipeline: { select: { id: true, name: true } },
            },
            take: 10,
            orderBy: { lastActivityAt: 'desc' },
        });
    }
};
exports.ScheduledTasksService = ScheduledTasksService;
exports.ScheduledTasksService = ScheduledTasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ScheduledTasksService);
//# sourceMappingURL=scheduled-tasks.service.js.map