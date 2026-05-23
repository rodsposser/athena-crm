import { LeadScoringService } from './lead-scoring.service';
import { CreateScoringRuleDto } from './dto/create-scoring-rule.dto';
import { UpdateScoringRuleDto } from './dto/update-scoring-rule.dto';
export declare class LeadScoringController {
    private readonly service;
    constructor(service: LeadScoringService);
    createRule(orgId: string, dto: CreateScoringRuleDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        organizationId: string;
        condition: import("@prisma/client/runtime/client").JsonValue;
        points: number;
    }>;
    findAllRules(orgId: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        organizationId: string;
        condition: import("@prisma/client/runtime/client").JsonValue;
        points: number;
    }[]>;
    findOneRule(orgId: string, id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        organizationId: string;
        condition: import("@prisma/client/runtime/client").JsonValue;
        points: number;
    }>;
    updateRule(orgId: string, id: string, dto: UpdateScoringRuleDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        organizationId: string;
        condition: import("@prisma/client/runtime/client").JsonValue;
        points: number;
    }>;
    deleteRule(orgId: string, id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        organizationId: string;
        condition: import("@prisma/client/runtime/client").JsonValue;
        points: number;
    }>;
    recalculateAll(orgId: string): Promise<{
        recalculated: number;
    }>;
    getLeadScore(orgId: string, leadId: string): Promise<{
        id: string;
        score: number;
        leadId: string;
        factors: import("@prisma/client/runtime/client").JsonValue;
        calculatedAt: Date;
    } | {
        leadId: string;
        score: number;
        factors: never[];
        calculatedAt: null;
    }>;
}
