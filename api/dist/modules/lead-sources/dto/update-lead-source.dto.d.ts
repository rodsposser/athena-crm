import { LeadSourceType } from '@prisma/client';
export declare class UpdateLeadSourceDto {
    name?: string;
    type?: LeadSourceType;
    color?: string;
    icon?: string;
    isDefault?: boolean;
    isActive?: boolean;
}
