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
exports.PipelinesController = void 0;
const common_1 = require("@nestjs/common");
const pipelines_service_1 = require("./pipelines.service");
const create_pipeline_dto_1 = require("./dto/create-pipeline.dto");
const update_pipeline_dto_1 = require("./dto/update-pipeline.dto");
const create_status_dto_1 = require("./dto/create-status.dto");
const update_status_dto_1 = require("./dto/update-status.dto");
const reorder_statuses_dto_1 = require("./dto/reorder-statuses.dto");
const create_transition_rule_dto_1 = require("./dto/create-transition-rule.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let PipelinesController = class PipelinesController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(orgId, dto) {
        return this.service.create(orgId, dto);
    }
    findAll(orgId) {
        return this.service.findAll(orgId);
    }
    findOne(orgId, id) {
        return this.service.findOne(orgId, id);
    }
    update(orgId, id, dto) {
        return this.service.update(orgId, id, dto);
    }
    remove(orgId, id) {
        return this.service.remove(orgId, id);
    }
    createStatus(orgId, pipelineId, dto) {
        return this.service.createStatus(orgId, pipelineId, dto);
    }
    updateStatus(orgId, statusId, dto) {
        return this.service.updateStatus(orgId, statusId, dto);
    }
    deleteStatus(orgId, statusId) {
        return this.service.deleteStatus(orgId, statusId);
    }
    reorderStatuses(orgId, pipelineId, dto) {
        return this.service.reorderStatuses(orgId, pipelineId, dto);
    }
    createTransitionRule(orgId, pipelineId, dto) {
        return this.service.createTransitionRule(orgId, pipelineId, dto);
    }
    getTransitionRules(orgId, pipelineId) {
        return this.service.getTransitionRules(orgId, pipelineId);
    }
    deleteTransitionRule(orgId, ruleId) {
        return this.service.deleteTransitionRule(orgId, ruleId);
    }
};
exports.PipelinesController = PipelinesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_pipeline_dto_1.CreatePipelineDto]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_pipeline_dto_1.UpdatePipelineDto]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':pipelineId/statuses'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('pipelineId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_status_dto_1.CreateStatusDto]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "createStatus", null);
__decorate([
    (0, common_1.Patch)('statuses/:statusId'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('statusId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_status_dto_1.UpdateStatusDto]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)('statuses/:statusId'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('statusId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "deleteStatus", null);
__decorate([
    (0, common_1.Patch)(':pipelineId/statuses/reorder'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('pipelineId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, reorder_statuses_dto_1.ReorderStatusesDto]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "reorderStatuses", null);
__decorate([
    (0, common_1.Post)(':pipelineId/transition-rules'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('pipelineId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_transition_rule_dto_1.CreateTransitionRuleDto]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "createTransitionRule", null);
__decorate([
    (0, common_1.Get)(':pipelineId/transition-rules'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('pipelineId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "getTransitionRules", null);
__decorate([
    (0, common_1.Delete)('transition-rules/:ruleId'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('ruleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PipelinesController.prototype, "deleteTransitionRule", null);
exports.PipelinesController = PipelinesController = __decorate([
    (0, common_1.Controller)('pipelines'),
    __metadata("design:paramtypes", [pipelines_service_1.PipelinesService])
], PipelinesController);
//# sourceMappingURL=pipelines.controller.js.map