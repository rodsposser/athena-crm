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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadScoringController = void 0;
const common_1 = require("@nestjs/common");
const lead_scoring_service_1 = require("./lead-scoring.service");
const create_scoring_rule_dto_1 = require("./dto/create-scoring-rule.dto");
const update_scoring_rule_dto_1 = require("./dto/update-scoring-rule.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let LeadScoringController = class LeadScoringController {
    service;
    constructor(service) {
        this.service = service;
    }
    createRule(orgId, dto) {
        return this.service.createRule(orgId, dto);
    }
    findAllRules(orgId) {
        return this.service.findAllRules(orgId);
    }
    findOneRule(orgId, id) {
        return this.service.findOneRule(orgId, id);
    }
    updateRule(orgId, id, dto) {
        return this.service.updateRule(orgId, id, dto);
    }
    deleteRule(orgId, id) {
        return this.service.deleteRule(orgId, id);
    }
    recalculateAll(orgId) {
        return this.service.recalculateAll(orgId);
    }
    getLeadScore(orgId, leadId) {
        return this.service.getLeadScore(orgId, leadId);
    }
};
exports.LeadScoringController = LeadScoringController;
__decorate([
    (0, common_1.Post)('scoring/rules'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_scoring_rule_dto_1.CreateScoringRuleDto]),
    __metadata("design:returntype", void 0)
], LeadScoringController.prototype, "createRule", null);
__decorate([
    (0, common_1.Get)('scoring/rules'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadScoringController.prototype, "findAllRules", null);
__decorate([
    (0, common_1.Get)('scoring/rules/:id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LeadScoringController.prototype, "findOneRule", null);
__decorate([
    (0, common_1.Patch)('scoring/rules/:id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_scoring_rule_dto_1.UpdateScoringRuleDto]),
    __metadata("design:returntype", void 0)
], LeadScoringController.prototype, "updateRule", null);
__decorate([
    (0, common_1.Delete)('scoring/rules/:id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LeadScoringController.prototype, "deleteRule", null);
__decorate([
    (0, common_1.Post)('scoring/recalculate'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadScoringController.prototype, "recalculateAll", null);
__decorate([
    (0, common_1.Get)('leads/:leadId/score'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('leadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LeadScoringController.prototype, "getLeadScore", null);
exports.LeadScoringController = LeadScoringController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [lead_scoring_service_1.LeadScoringService])
], LeadScoringController);
//# sourceMappingURL=lead-scoring.controller.js.map