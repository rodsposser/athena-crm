"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadScoringService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const create_scoring_rule_dto_1 = require("./dto/create-scoring-rule.dto");
let LeadScoringService = class LeadScoringService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRule(orgId, dto) {
        return this.prisma.scoringRule.create({
            data: {
                organizationId: orgId,
                name: dto.name,
                condition: dto.condition,
                points: dto.points,
                isActive: dto.isActive ?? true,
            },
        });
    }
    async findAllRules(orgId) {
        return this.prisma.scoringRule.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOneRule(orgId, id) {
        const rule = await this.prisma.scoringRule.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!rule)
            throw new common_1.NotFoundException('Scoring rule not found');
        return rule;
    }
    async updateRule(orgId, id, dto) {
        await this.findOneRule(orgId, id);
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name;
        if (dto.condition !== undefined)
            data.condition = dto.condition;
        if (dto.points !== undefined)
            data.points = dto.points;
        if (dto.isActive !== undefined)
            data.isActive = dto.isActive;
        return this.prisma.scoringRule.update({ where: { id }, data });
    }
    async deleteRule(orgId, id) {
        await this.findOneRule(orgId, id);
        return this.prisma.scoringRule.delete({ where: { id } });
    }
    calculateScore(lead, rules) {
        const factors = [];
        let totalScore = 0;
        for (const rule of rules) {
            const condition = rule.condition;
            const matched = this.evaluateCondition(lead, condition);
            factors.push({
                ruleId: rule.id,
                ruleName: rule.name,
                field: condition.field,
                operator: condition.operator,
                points: rule.points,
                matched,
            });
            if (matched) {
                totalScore += rule.points;
            }
        }
        return { score: totalScore, factors };
    }
    evaluateCondition(lead, condition) {
        const fieldValue = lead[condition.field];
        switch (condition.operator) {
            case create_scoring_rule_dto_1.ConditionOperator.EQUALS:
                return fieldValue == condition.value;
            case create_scoring_rule_dto_1.ConditionOperator.NOT_EQUALS:
                return fieldValue != condition.value;
            case create_scoring_rule_dto_1.ConditionOperator.GREATER_THAN:
                return typeof fieldValue === 'number' && fieldValue > Number(condition.value);
            case create_scoring_rule_dto_1.ConditionOperator.LESS_THAN:
                return typeof fieldValue === 'number' && fieldValue < Number(condition.value);
            case create_scoring_rule_dto_1.ConditionOperator.CONTAINS:
                return typeof fieldValue === 'string' &&
                    fieldValue.toLowerCase().includes(String(condition.value).toLowerCase());
            case create_scoring_rule_dto_1.ConditionOperator.IS_SET:
                return fieldValue !== null && fieldValue !== undefined;
            case create_scoring_rule_dto_1.ConditionOperator.IS_NOT_SET:
                return fieldValue === null || fieldValue === undefined;
            default:
                return false;
        }
    }
    async recalculateForLead(orgId, leadId) {
        const lead = await this.prisma.lead.findFirst({
            where: { id: leadId, organizationId: orgId, deletedAt: null },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        const rules = await this.prisma.scoringRule.findMany({
            where: { organizationId: orgId, isActive: true },
        });
        const { score, factors } = this.calculateScore(lead, rules);
        return this.prisma.leadScore.upsert({
            where: { leadId },
            update: {
                score,
                factors: factors,
                calculatedAt: new Date(),
            },
            create: {
                leadId,
                score,
                factors: factors,
                calculatedAt: new Date(),
            },
        });
    }
    async recalculateAll(orgId) {
        const [leads, rules] = await Promise.all([
            this.prisma.lead.findMany({
                where: { organizationId: orgId, deletedAt: null },
            }),
            this.prisma.scoringRule.findMany({
                where: { organizationId: orgId, isActive: true },
            }),
        ]);
        const results = [];
        for (const lead of leads) {
            const { score, factors } = this.calculateScore(lead, rules);
            const result = await this.prisma.leadScore.upsert({
                where: { leadId: lead.id },
                update: {
                    score,
                    factors: factors,
                    calculatedAt: new Date(),
                },
                create: {
                    leadId: lead.id,
                    score,
                    factors: factors,
                    calculatedAt: new Date(),
                },
            });
            results.push(result);
        }
        return { recalculated: results.length };
    }
    async getLeadScore(orgId, leadId) {
        const lead = await this.prisma.lead.findFirst({
            where: { id: leadId, organizationId: orgId, deletedAt: null },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        const score = await this.prisma.leadScore.findUnique({
            where: { leadId },
        });
        if (!score) {
            return { leadId, score: 0, factors: [], calculatedAt: null };
        }
        return score;
    }
};
exports.LeadScoringService = LeadScoringService;
exports.LeadScoringService = LeadScoringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadScoringService);
//# sourceMappingURL=lead-scoring.service.js.map