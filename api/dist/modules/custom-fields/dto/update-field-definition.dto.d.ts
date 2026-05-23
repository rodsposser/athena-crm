import { CustomFieldType } from '@prisma/client';
export declare class UpdateFieldDefinitionDto {
    name?: string;
    type?: CustomFieldType;
    options?: any[];
    defaultValue?: string;
    isRequired?: boolean;
    isVisibleOnCard?: boolean;
    isFilterable?: boolean;
    position?: number;
    validationRules?: any;
}
