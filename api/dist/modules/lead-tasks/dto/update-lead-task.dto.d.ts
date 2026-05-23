import { LeadPriority } from '@prisma/client';
export declare class UpdateLeadTaskDto {
    title?: string;
    description?: string;
    dueDate?: string;
    assigneeId?: string;
    priority?: LeadPriority;
}
