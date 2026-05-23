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
exports.LeadTasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LeadTasksService = class LeadTasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    taskInclude = {
        assignee: { select: { id: true, name: true, avatarUrl: true } },
        creator: { select: { id: true, name: true } },
        lead: { select: { id: true, title: true } },
    };
    async findByLead(leadId) {
        return this.prisma.leadTask.findMany({
            where: { leadId },
            orderBy: { createdAt: 'desc' },
            include: this.taskInclude,
        });
    }
    async findMine(userId, status) {
        const now = new Date();
        const where = { assigneeId: userId };
        if (status === 'pending') {
            where.completedAt = null;
        }
        else if (status === 'completed') {
            where.completedAt = { not: null };
        }
        else if (status === 'overdue') {
            where.completedAt = null;
            where.dueDate = { lt: now };
        }
        return this.prisma.leadTask.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: this.taskInclude,
        });
    }
    async create(leadId, userId, dto) {
        return this.prisma.leadTask.create({
            data: {
                leadId,
                createdBy: userId,
                assigneeId: dto.assigneeId,
                title: dto.title,
                description: dto.description,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
                priority: dto.priority ?? 'MEDIUM',
            },
            include: this.taskInclude,
        });
    }
    async update(id, dto) {
        const task = await this.prisma.leadTask.findUnique({ where: { id } });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return this.prisma.leadTask.update({
            where: { id },
            data: {
                ...(dto.title !== undefined ? { title: dto.title } : {}),
                ...(dto.description !== undefined ? { description: dto.description } : {}),
                ...(dto.dueDate !== undefined ? { dueDate: new Date(dto.dueDate) } : {}),
                ...(dto.assigneeId !== undefined ? { assigneeId: dto.assigneeId } : {}),
                ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
            },
            include: this.taskInclude,
        });
    }
    async complete(id) {
        const task = await this.prisma.leadTask.findUnique({ where: { id } });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return this.prisma.leadTask.update({
            where: { id },
            data: { completedAt: new Date() },
            include: this.taskInclude,
        });
    }
};
exports.LeadTasksService = LeadTasksService;
exports.LeadTasksService = LeadTasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadTasksService);
//# sourceMappingURL=lead-tasks.service.js.map