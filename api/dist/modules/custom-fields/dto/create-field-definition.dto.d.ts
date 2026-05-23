import { CustomFieldType } from '@prisma/client';
export declare class CreateFieldDefinitionDto {
    name: string;
    type: CustomFieldType;
    options?: any[];
    defaultValue?: string;
    isRequired?: boolean;
    isVisibleOnCard?: boolean;
    isFilterable?: boolean;
    position?: number;
    validationRules?: any;
}
