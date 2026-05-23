import { LeadPriority } from '@prisma/client';
export declare class CreateLeadTaskDto {
    title: string;
    description?: string;
    dueDate?: string;
    assigneeId: string;
    priority?: LeadPriority;
}
