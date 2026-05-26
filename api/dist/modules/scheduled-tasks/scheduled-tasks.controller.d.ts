import { ScheduledTasksService } from './scheduled-tasks.service';
import { CreateScheduledTaskDto } from './dto/create-scheduled-task.dto';
import { CompleteScheduledTaskDto } from './dto/complete-scheduled-task.dto';
import type { JwtUser } from '../../common/decorators/current-user.decorator';
export declare class ScheduledTasksController {
    private readonly service;
    constructor(service: ScheduledTasksService);
    findByPeriod(orgId: string, dateFrom: string, dateTo: string): Promise<({
        lead: {
            pipeline: {
                name: string;
                id: string;
            };
            company: {
                name: string;
                id: string;
            } | null;
            contact: {
                name: string;
                id: string;
                phone: string | null;
            } | null;
            status: {
                name: string;
                id: string;
                color: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            position: number;
            pipelineId: string;
            statusId: string;
            title: string;
            estimatedValue: number;
            priority: import("@prisma/client").$Enums.LeadPriority;
            temperature: import("@prisma/client").$Enums.LeadTemperature;
            assigneeId: string | null;
            probability: number | null;
            expectedCloseDate: Date | null;
            lostReason: string | null;
            version: number;
            contactId: string | null;
            companyId: string | null;
            wonAt: Date | null;
            lostAt: Date | null;
            lastActivityAt: Date;
            lastStatusChangedAt: Date;
            sourceId: string | null;
        };
        createdBy: {
            name: string;
            id: string;
        };
        movedToStatus: {
            name: string;
            id: string;
            color: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        organizationId: string;
        status: import("@prisma/client").$Enums.ScheduledTaskStatus;
        leadId: string;
        type: import("@prisma/client").$Enums.ScheduledTaskType;
        completedAt: Date | null;
        scheduledAt: Date;
        outcome: string | null;
        movedToStatusId: string | null;
        createdById: string;
    })[]>;
    findMetrics(orgId: string, date: string): Promise<{
        callsToday: number;
        meetingsToday: number;
        completedToday: number;
    }>;
    searchLeads(orgId: string, query: string): Promise<({
        pipeline: {
            name: string;
            id: string;
        };
        company: {
            name: string;
            id: string;
        } | null;
        contact: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        status: {
            name: string;
            id: string;
            color: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        position: number;
        pipelineId: string;
        statusId: string;
        title: string;
        estimatedValue: number;
        priority: import("@prisma/client").$Enums.LeadPriority;
        temperature: import("@prisma/client").$Enums.LeadTemperature;
        assigneeId: string | null;
        probability: number | null;
        expectedCloseDate: Date | null;
        lostReason: string | null;
        version: number;
        contactId: string | null;
        companyId: string | null;
        wonAt: Date | null;
        lostAt: Date | null;
        lastActivityAt: Date;
        lastStatusChangedAt: Date;
        sourceId: string | null;
    })[]>;
    create(orgId: string, user: JwtUser, dto: CreateScheduledTaskDto): Promise<{
        lead: {
            pipeline: {
                name: string;
                id: string;
            };
            company: {
                name: string;
                id: string;
            } | null;
            contact: {
                name: string;
                id: string;
                phone: string | null;
            } | null;
            status: {
                name: string;
                id: string;
                color: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            position: number;
            pipelineId: string;
            statusId: string;
            title: string;
            estimatedValue: number;
            priority: import("@prisma/client").$Enums.LeadPriority;
            temperature: import("@prisma/client").$Enums.LeadTemperature;
            assigneeId: string | null;
            probability: number | null;
            expectedCloseDate: Date | null;
            lostReason: string | null;
            version: number;
            contactId: string | null;
            companyId: string | null;
            wonAt: Date | null;
            lostAt: Date | null;
            lastActivityAt: Date;
            lastStatusChangedAt: Date;
            sourceId: string | null;
        };
        createdBy: {
            name: string;
            id: string;
        };
        movedToStatus: {
            name: string;
            id: string;
            color: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        organizationId: string;
        status: import("@prisma/client").$Enums.ScheduledTaskStatus;
        leadId: string;
        type: import("@prisma/client").$Enums.ScheduledTaskType;
        completedAt: Date | null;
        scheduledAt: Date;
        outcome: string | null;
        movedToStatusId: string | null;
        createdById: string;
    }>;
    complete(orgId: string, id: string, dto: CompleteScheduledTaskDto): Promise<{
        lead: {
            pipeline: {
                name: string;
                id: string;
            };
            company: {
                name: string;
                id: string;
            } | null;
            contact: {
                name: string;
                id: string;
                phone: string | null;
            } | null;
            status: {
                name: string;
                id: string;
                color: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            position: number;
            pipelineId: string;
            statusId: string;
            title: string;
            estimatedValue: number;
            priority: import("@prisma/client").$Enums.LeadPriority;
            temperature: import("@prisma/client").$Enums.LeadTemperature;
            assigneeId: string | null;
            probability: number | null;
            expectedCloseDate: Date | null;
            lostReason: string | null;
            version: number;
            contactId: string | null;
            companyId: string | null;
            wonAt: Date | null;
            lostAt: Date | null;
            lastActivityAt: Date;
            lastStatusChangedAt: Date;
            sourceId: string | null;
        };
        createdBy: {
            name: string;
            id: string;
        };
        movedToStatus: {
            name: string;
            id: string;
            color: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        organizationId: string;
        status: import("@prisma/client").$Enums.ScheduledTaskStatus;
        leadId: string;
        type: import("@prisma/client").$Enums.ScheduledTaskType;
        completedAt: Date | null;
        scheduledAt: Date;
        outcome: string | null;
        movedToStatusId: string | null;
        createdById: string;
    }>;
    cancel(orgId: string, id: string): Promise<{
        lead: {
            pipeline: {
                name: string;
                id: string;
            };
            company: {
                name: string;
                id: string;
            } | null;
            contact: {
                name: string;
                id: string;
                phone: string | null;
            } | null;
            status: {
                name: string;
                id: string;
                color: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            position: number;
            pipelineId: string;
            statusId: string;
            title: string;
            estimatedValue: number;
            priority: import("@prisma/client").$Enums.LeadPriority;
            temperature: import("@prisma/client").$Enums.LeadTemperature;
            assigneeId: string | null;
            probability: number | null;
            expectedCloseDate: Date | null;
            lostReason: string | null;
            version: number;
            contactId: string | null;
            companyId: string | null;
            wonAt: Date | null;
            lostAt: Date | null;
            lastActivityAt: Date;
            lastStatusChangedAt: Date;
            sourceId: string | null;
        };
        createdBy: {
            name: string;
            id: string;
        };
        movedToStatus: {
            name: string;
            id: string;
            color: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        organizationId: string;
        status: import("@prisma/client").$Enums.ScheduledTaskStatus;
        leadId: string;
        type: import("@prisma/client").$Enums.ScheduledTaskType;
        completedAt: Date | null;
        scheduledAt: Date;
        outcome: string | null;
        movedToStatusId: string | null;
        createdById: string;
    }>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        organizationId: string;
        status: import("@prisma/client").$Enums.ScheduledTaskStatus;
        leadId: string;
        type: import("@prisma/client").$Enums.ScheduledTaskType;
        completedAt: Date | null;
        scheduledAt: Date;
        outcome: string | null;
        movedToStatusId: string | null;
        createdById: string;
    }>;
}
