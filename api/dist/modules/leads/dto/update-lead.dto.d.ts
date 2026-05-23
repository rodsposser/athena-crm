import { LeadPriority, LeadTemperature } from '@prisma/client';
export declare class UpdateLeadDto {
    title?: string;
    estimatedValue?: number;
    probability?: number;
    priority?: LeadPriority;
    temperature?: LeadTemperature;
    expectedCloseDate?: string;
    lostReason?: string;
    version: number;
}
