import { PrismaService } from '../../prisma/prisma.service';
import { CreateFieldDefinitionDto } from './dto/create-field-definition.dto';
import { UpdateFieldDefinitionDto } from './dto/update-field-definition.dto';
import { FieldValueItemDto } from './dto/set-field-values.dto';
export declare class CustomFieldsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    listDefinitions(pipelineId: string): Promise<{
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
    createDefinition(pipelineId: string, dto: CreateFieldDefinitionDto): Promise<{
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
    updateDefinition(id: string, dto: UpdateFieldDefinitionDto): Promise<{
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
    deleteDefinition(id: string): Promise<{
        deleted: boolean;
    }>;
    setValues(leadId: string, items: FieldValueItemDto[]): Promise<{
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
    getValues(leadId: string): Promise<({
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
    private resolveValueColumns;
}
