import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadTaskDto } from './dto/create-lead-task.dto';
import { UpdateLeadTaskDto } from './dto/update-lead-task.dto';
export declare class LeadTasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly taskInclude;
    findByLead(leadId: string): Promise<({
        lead: {
            id: string;
            title: string;
        };
        assignee: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
        creator: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        priority: import("@prisma/client").$Enums.LeadPriority;
        assigneeId: string;
        leadId: string;
        dueDate: Date | null;
        createdBy: string;
        completedAt: Date | null;
    })[]>;
    findMine(userId: string, status?: string): Promise<({
        lead: {
            id: string;
            title: string;
        };
        assignee: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
        creator: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        priority: import("@prisma/client").$Enums.LeadPriority;
        assigneeId: string;
        leadId: string;
        dueDate: Date | null;
        createdBy: string;
        completedAt: Date | null;
    })[]>;
    create(leadId: string, userId: string, dto: CreateLeadTaskDto): Promise<{
        lead: {
            id: string;
            title: string;
        };
        assignee: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
        creator: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        priority: import("@prisma/client").$Enums.LeadPriority;
        assigneeId: string;
        leadId: string;
        dueDate: Date | null;
        createdBy: string;
        completedAt: Date | null;
    }>;
    update(id: string, dto: UpdateLeadTaskDto): Promise<{
        lead: {
            id: string;
            title: string;
        };
        assignee: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
        creator: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        priority: import("@prisma/client").$Enums.LeadPriority;
        assigneeId: string;
        leadId: string;
        dueDate: Date | null;
        createdBy: string;
        completedAt: Date | null;
    }>;
    complete(id: string): Promise<{
        lead: {
            id: string;
            title: string;
        };
        assignee: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
        creator: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        priority: import("@prisma/client").$Enums.LeadPriority;
        assigneeId: string;
        leadId: string;
        dueDate: Date | null;
        createdBy: string;
        completedAt: Date | null;
    }>;
}
