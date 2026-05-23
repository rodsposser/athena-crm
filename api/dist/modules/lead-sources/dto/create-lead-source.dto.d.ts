import { LeadSourceType } from '@prisma/client';
export declare class CreateLeadSourceDto {
    name: string;
    type?: LeadSourceType;
    color?: string;
    icon?: string;
    isDefault?: boolean;
}
