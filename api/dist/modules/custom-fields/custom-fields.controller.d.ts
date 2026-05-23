import { CustomFieldsService } from './custom-fields.service';
import { CreateFieldDefinitionDto } from './dto/create-field-definition.dto';
import { UpdateFieldDefinitionDto } from './dto/update-field-definition.dto';
import { SetFieldValuesDto } from './dto/set-field-values.dto';
export declare class CustomFieldsController {
    private readonly service;
    constructor(service: CustomFieldsService);
    listDefinitions(_orgId: string, pipelineId: string): Promise<{
        options: import("@prisma/client/runtime/client").JsonValue | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        position: number;
        pipelineId: string;
        type: import("@prisma/client").$Enums.CustomFieldType;
        defaultValue: string | null;
        isRequired: boolean;
        isVisibleOnCard: boolean;
        isFilterable: boolean;
        validationRules: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    createDefinition(_orgId: string, pipelineId: string, dto: CreateFieldDefinitionDto): Promise<{
        options: import("@prisma/client/runtime/client").JsonValue | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        position: number;
        pipelineId: string;
        type: import("@prisma/client").$Enums.CustomFieldType;
        defaultValue: string | null;
        isRequired: boolean;
        isVisibleOnCard: boolean;
        isFilterable: boolean;
        validationRules: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    updateDefinition(_orgId: string, id: string, dto: UpdateFieldDefinitionDto): Promise<{
        options: import("@prisma/client/runtime/client").JsonValue | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        position: number;
        pipelineId: string;
        type: import("@prisma/client").$Enums.CustomFieldType;
        defaultValue: string | null;
        isRequired: boolean;
        isVisibleOnCard: boolean;
        isFilterable: boolean;
        validationRules: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    deleteDefinition(_orgId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    setValues(_orgId: string, leadId: string, dto: SetFieldValuesDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        leadId: string;
        fieldDefinitionId: string;
        textValue: string | null;
        numberValue: number | null;
        dateValue: Date | null;
        booleanValue: boolean | null;
        jsonValue: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    getValues(_orgId: string, leadId: string): Promise<({
        fieldDefinition: {
            options: import("@prisma/client/runtime/client").JsonValue | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            position: number;
            pipelineId: string;
            type: import("@prisma/client").$Enums.CustomFieldType;
            defaultValue: string | null;
            isRequired: boolean;
            isVisibleOnCard: boolean;
            isFilterable: boolean;
            validationRules: import("@prisma/client/runtime/client").JsonValue | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        leadId: string;
        fieldDefinitionId: string;
        textValue: string | null;
        numberValue: number | null;
        dateValue: Date | null;
        booleanValue: boolean | null;
        jsonValue: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
}
