import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScheduledTaskDto } from './dto/create-scheduled-task.dto';
import { CompleteScheduledTaskDto } from './dto/complete-scheduled-task.dto';

@Injectable()
export class ScheduledTasksService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
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

  async findByPeriod(orgId: string, dateFrom: string, dateTo: string) {
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

  async findMetrics(orgId: string, date: string) {
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

  async create(orgId: string, userId: string, dto: CreateScheduledTaskDto) {
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

  async complete(orgId: string, id: string, dto: CompleteScheduledTaskDto) {
    const task = await this.prisma.scheduledTask.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!task) throw new NotFoundException('Task not found');

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

  async cancel(orgId: string, id: string) {
    const task = await this.prisma.scheduledTask.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.scheduledTask.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: this.include,
    });
  }

  async remove(orgId: string, id: string) {
    const task = await this.prisma.scheduledTask.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.scheduledTask.delete({ where: { id } });
  }

  async searchLeads(orgId: string, query: string) {
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
}
