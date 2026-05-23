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
var AutomationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const MAX_DEPTH = 3;
let AutomationsService = AutomationsService_1 = class AutomationsService {
    prisma;
    logger = new common_1.Logger(AutomationsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(orgId, dto) {
        return this.prisma.automationRule.create({
            data: {
                organizationId: orgId,
                name: dto.name,
                pipelineId: dto.pipelineId,
                trigger: dto.trigger,
                conditions: dto.conditions,
                actions: dto.actions,
                isActive: dto.isActive ?? true,
            },
        });
    }
    async findAll(orgId) {
        return this.prisma.automationRule.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(orgId, id) {
        const rule = await this.prisma.automationRule.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!rule)
            throw new common_1.NotFoundException('Automation rule not found');
        return rule;
    }
    async update(orgId, id, dto) {
        await this.findOne(orgId, id);
        return this.prisma.automationRule.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.pipelineId !== undefined && { pipelineId: dto.pipelineId }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.trigger !== undefined && { trigger: dto.trigger }),
                ...(dto.conditions !== undefined && { conditions: dto.conditions }),
                ...(dto.actions !== undefined && { actions: dto.actions }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
        });
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        return this.prisma.automationRule.delete({ where: { id } });
    }
    async findLogs(orgId, ruleId, limit = 50, cursor) {
        await this.findOne(orgId, ruleId);
        return this.prisma.automationLog.findMany({
            where: { ruleId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        });
    }
    async preview(orgId, id) {
        const rule = await this.findOne(orgId, id);
        const trigger = rule.trigger;
        const conditions = (rule.conditions ?? []);
        const where = {
            organizationId: orgId,
            deletedAt: null,
        };
        if (rule.pipelineId) {
            where.pipelineId = rule.pipelineId;
        }
        for (const cond of conditions) {
            this.applyConditionToWhere(where, cond);
        }
        const count = await this.prisma.lead.count({ where });
        return {
            ruleId: id,
            triggerType: trigger.type,
            conditionsCount: conditions.length,
            matchingLeads: count,
        };
    }
    async evaluateRules(leadId, eventType, eventData, depth = 0) {
        if (depth >= MAX_DEPTH) {
            this.logger.warn(`Max automation depth (${MAX_DEPTH}) reached for lead ${leadId}. Stopping.`);
            return;
        }
        const lead = await this.prisma.lead.findUnique({
            where: { id: leadId },
            include: { status: true, pipeline: true, assignee: true },
        });
        if (!lead)
            return;
        const rules = await this.prisma.automationRule.findMany({
            where: {
                organizationId: lead.organizationId,
                isActive: true,
                ...(lead.pipelineId
                    ? {
                        OR: [
                            { pipelineId: lead.pipelineId },
                            { pipelineId: null },
                        ],
                    }
                    : {}),
            },
        });
        for (const rule of rules) {
            const trigger = rule.trigger;
            if (trigger.type !== eventType)
                continue;
            if (!this.matchTriggerParams(trigger.params, eventData))
                continue;
            const conditions = (rule.conditions ?? []);
            if (!this.evaluateConditions(conditions, lead, eventData))
                continue;
            const startTime = Date.now();
            const executedActions = [];
            let error;
            try {
                const actions = rule.actions;
                for (const action of actions) {
                    const result = await this.executeAction(action, lead, eventData);
                    executedActions.push({ type: action.type, params: action.params, result });
                }
            }
            catch (err) {
                error = err.message;
                this.logger.error(`Automation rule ${rule.id} failed for lead ${leadId}: ${err.message}`);
            }
            const executionTimeMs = Date.now() - startTime;
            await this.prisma.automationLog.create({
                data: {
                    ruleId: rule.id,
                    leadId,
                    status: error ? 'FAILED' : 'SUCCESS',
                    executedActions,
                    error,
                    executionTimeMs,
                },
            });
            await this.prisma.automationRule.update({
                where: { id: rule.id },
                data: {
                    executionCount: { increment: 1 },
                    lastExecutedAt: new Date(),
                },
            });
        }
    }
    matchTriggerParams(params, eventData) {
        if (!params)
            return true;
        for (const [key, value] of Object.entries(params)) {
            if (eventData[key] !== value)
                return false;
        }
        return true;
    }
    evaluateConditions(conditions, lead, eventData) {
        for (const cond of conditions) {
            const fieldValue = this.resolveField(cond.field, lead, eventData);
            if (!this.evaluateOperator(fieldValue, cond.operator, cond.value)) {
                return false;
            }
        }
        return true;
    }
    resolveField(field, lead, eventData) {
        if (field.startsWith('event.')) {
            return eventData[field.slice(6)];
        }
        const parts = field.split('.');
        let value = lead;
        for (const part of parts) {
            value = value?.[part];
        }
        return value;
    }
    evaluateOperator(fieldValue, operator, condValue) {
        switch (operator) {
            case 'EQUALS':
                return fieldValue === condValue;
            case 'NOT_EQUALS':
                return fieldValue !== condValue;
            case 'CONTAINS':
                return typeof fieldValue === 'string' && fieldValue.includes(condValue);
            case 'GT':
                return fieldValue > condValue;
            case 'LT':
                return fieldValue < condValue;
            case 'IN':
                return Array.isArray(condValue) && condValue.includes(fieldValue);
            case 'NOT_IN':
                return Array.isArray(condValue) && !condValue.includes(fieldValue);
            default:
                this.logger.warn(`Unknown condition operator: ${operator}`);
                return false;
        }
    }
    async executeAction(action, lead, _eventData) {
        switch (action.type) {
            case 'MOVE_TO_STATUS':
                this.logger.log(`[ACTION] MOVE_TO_STATUS: lead=${lead.id} -> statusId=${action.params.statusId}`);
                return `Would move lead to status ${action.params.statusId}`;
            case 'ASSIGN_TO':
                this.logger.log(`[ACTION] ASSIGN_TO: lead=${lead.id} -> assigneeId=${action.params.assigneeId}`);
                return `Would assign lead to ${action.params.assigneeId}`;
            case 'ADD_TAG':
                this.logger.log(`[ACTION] ADD_TAG: lead=${lead.id} -> tag=${action.params.tagId}`);
                return `Would add tag ${action.params.tagId}`;
            case 'SET_FIELD':
                this.logger.log(`[ACTION] SET_FIELD: lead=${lead.id} -> ${action.params.field}=${action.params.value}`);
                return `Would set ${action.params.field} to ${action.params.value}`;
            case 'SEND_NOTIFICATION':
                this.logger.log(`[ACTION] SEND_NOTIFICATION: lead=${lead.id} -> ${action.params.message}`);
                return `Would send notification: ${action.params.message}`;
            default:
                this.logger.warn(`Unknown action type: ${action.type}`);
                return `Unknown action type: ${action.type}`;
        }
    }
    applyConditionToWhere(where, cond) {
        const field = cond.field;
        if (field.startsWith('event.'))
            return;
        switch (cond.operator) {
            case 'EQUALS':
                where[field] = cond.value;
                break;
            case 'NOT_EQUALS':
                where[field] = { not: cond.value };
                break;
            case 'CONTAINS':
                where[field] = { contains: cond.value, mode: 'insensitive' };
                break;
            case 'IN':
                where[field] = { in: cond.value };
                break;
            case 'NOT_IN':
                where[field] = { notIn: cond.value };
                break;
            case 'GT':
                where[field] = { gt: cond.value };
                break;
            case 'LT':
                where[field] = { lt: cond.value };
                break;
        }
    }
};
exports.AutomationsService = AutomationsService;
exports.AutomationsService = AutomationsService = AutomationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AutomationsService);
//# sourceMappingURL=automations.service.js.map