import { LeadPriority, LeadTemperature } from '@prisma/client';
export declare class CreateLeadDto {
    pipelineId: string;
    title: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    companyName?: string;
    estimatedValue?: number;
    priority?: LeadPriority;
    temperature?: LeadTemperature;
    assigneeId?: string;
    statusId?: string;
}
