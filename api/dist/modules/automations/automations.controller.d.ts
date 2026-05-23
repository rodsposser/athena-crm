import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
export declare class AutomationsController {
    private readonly service;
    constructor(service: AutomationsService);
    create(orgId: string, dto: CreateAutomationDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        pipelineId: string | null;
        trigger: import("@prisma/client/runtime/client").JsonValue;
        conditions: import("@prisma/client/runtime/client").JsonValue | null;
        actions: import("@prisma/client/runtime/client").JsonValue;
        executionCount: number;
        lastExecutedAt: Date | null;
    }>;
    findAll(orgId: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        pipelineId: string | null;
        trigger: import("@prisma/client/runtime/client").JsonValue;
        conditions: import("@prisma/client/runtime/client").JsonValue | null;
        actions: import("@prisma/client/runtime/client").JsonValue;
        executionCount: number;
        lastExecutedAt: Date | null;
    }[]>;
    findOne(orgId: string, id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        pipelineId: string | null;
        trigger: import("@prisma/client/runtime/client").JsonValue;
        conditions: import("@prisma/client/runtime/client").JsonValue | null;
        actions: import("@prisma/client/runtime/client").JsonValue;
        executionCount: number;
        lastExecutedAt: Date | null;
    }>;
    update(orgId: string, id: string, dto: UpdateAutomationDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        pipelineId: string | null;
        trigger: import("@prisma/client/runtime/client").JsonValue;
        conditions: import("@prisma/client/runtime/client").JsonValue | null;
        actions: import("@prisma/client/runtime/client").JsonValue;
        executionCount: number;
        lastExecutedAt: Date | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        pipelineId: string | null;
        trigger: import("@prisma/client/runtime/client").JsonValue;
        conditions: import("@prisma/client/runtime/client").JsonValue | null;
        actions: import("@prisma/client/runtime/client").JsonValue;
        executionCount: number;
        lastExecutedAt: Date | null;
    }>;
    findLogs(orgId: string, id: string, limit?: string, cursor?: string): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        ruleId: string;
        status: string;
        leadId: string;
        executedActions: import("@prisma/client/runtime/client").JsonValue;
        executionTimeMs: number;
    }[]>;
    preview(orgId: string, id: string): Promise<{
        ruleId: string;
        triggerType: any;
        conditionsCount: number;
        matchingLeads: number;
    }>;
}
