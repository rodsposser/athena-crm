import { PipelinesService } from './pipelines.service';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ReorderStatusesDto } from './dto/reorder-statuses.dto';
import { CreateTransitionRuleDto } from './dto/create-transition-rule.dto';
export declare class PipelinesController {
    private readonly service;
    constructor(service: PipelinesService);
    create(orgId: string, dto: CreatePipelineDto): Promise<{
        statuses: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            isFinal: boolean;
            isWon: boolean;
            isMql: boolean;
            isMeeting: boolean;
            staleAfterDays: number | null;
            isDefault: boolean;
            position: number;
            pipelineId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        description: string | null;
        isArchived: boolean;
        position: number;
        currency: string;
    }>;
    findAll(orgId: string): Promise<({
        statuses: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            isFinal: boolean;
            isWon: boolean;
            isMql: boolean;
            isMeeting: boolean;
            staleAfterDays: number | null;
            isDefault: boolean;
            position: number;
            pipelineId: string;
        }[];
        _count: {
            statuses: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        description: string | null;
        isArchived: boolean;
        position: number;
        currency: string;
    })[]>;
    findOne(orgId: string, id: string): Promise<{
        statuses: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            isFinal: boolean;
            isWon: boolean;
            isMql: boolean;
            isMeeting: boolean;
            staleAfterDays: number | null;
            isDefault: boolean;
            position: number;
            pipelineId: string;
        }[];
        transitionRules: {
            id: string;
            createdAt: Date;
            fromStatusId: string;
            toStatusId: string;
            isAllowed: boolean;
            requiredFields: import("@prisma/client/runtime/client").JsonValue | null;
            pipelineId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        description: string | null;
        isArchived: boolean;
        position: number;
        currency: string;
    }>;
    update(orgId: string, id: string, dto: UpdatePipelineDto): Promise<{
        statuses: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            isFinal: boolean;
            isWon: boolean;
            isMql: boolean;
            isMeeting: boolean;
            staleAfterDays: number | null;
            isDefault: boolean;
            position: number;
            pipelineId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        description: string | null;
        isArchived: boolean;
        position: number;
        currency: string;
    }>;
    remove(orgId: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        description: string | null;
        isArchived: boolean;
        position: number;
        currency: string;
    }>;
    createStatus(orgId: string, pipelineId: string, dto: CreateStatusDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        isFinal: boolean;
        isWon: boolean;
        isMql: boolean;
        isMeeting: boolean;
        staleAfterDays: number | null;
        isDefault: boolean;
        position: number;
        pipelineId: string;
    }>;
    updateStatus(orgId: string, statusId: string, dto: UpdateStatusDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        isFinal: boolean;
        isWon: boolean;
        isMql: boolean;
        isMeeting: boolean;
        staleAfterDays: number | null;
        isDefault: boolean;
        position: number;
        pipelineId: string;
    }>;
    deleteStatus(orgId: string, statusId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        isFinal: boolean;
        isWon: boolean;
        isMql: boolean;
        isMeeting: boolean;
        staleAfterDays: number | null;
        isDefault: boolean;
        position: number;
        pipelineId: string;
    }>;
    reorderStatuses(orgId: string, pipelineId: string, dto: ReorderStatusesDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        isFinal: boolean;
        isWon: boolean;
        isMql: boolean;
        isMeeting: boolean;
        staleAfterDays: number | null;
        isDefault: boolean;
        position: number;
        pipelineId: string;
    }[]>;
    createTransitionRule(orgId: string, pipelineId: string, dto: CreateTransitionRuleDto): Promise<{
        id: string;
        createdAt: Date;
        fromStatusId: string;
        toStatusId: string;
        isAllowed: boolean;
        requiredFields: import("@prisma/client/runtime/client").JsonValue | null;
        pipelineId: string;
    }>;
    getTransitionRules(orgId: string, pipelineId: string): Promise<({
        fromStatus: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            isFinal: boolean;
            isWon: boolean;
            isMql: boolean;
            isMeeting: boolean;
            staleAfterDays: number | null;
            isDefault: boolean;
            position: number;
            pipelineId: string;
        };
        toStatus: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            isFinal: boolean;
            isWon: boolean;
            isMql: boolean;
            isMeeting: boolean;
            staleAfterDays: number | null;
            isDefault: boolean;
            position: number;
            pipelineId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        fromStatusId: string;
        toStatusId: string;
        isAllowed: boolean;
        requiredFields: import("@prisma/client/runtime/client").JsonValue | null;
        pipelineId: string;
    })[]>;
    deleteTransitionRule(orgId: string, ruleId: string): Promise<{
        id: string;
        createdAt: Date;
        fromStatusId: string;
        toStatusId: string;
        isAllowed: boolean;
        requiredFields: import("@prisma/client/runtime/client").JsonValue | null;
        pipelineId: string;
    }>;
}
