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
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const leads_service_1 = require("./leads.service");
const create_lead_dto_1 = require("./dto/create-lead.dto");
const update_lead_dto_1 = require("./dto/update-lead.dto");
const move_lead_dto_1 = require("./dto/move-lead.dto");
const assign_lead_dto_1 = require("./dto/assign-lead.dto");
const bulk_action_dto_1 = require("./dto/bulk-action.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let LeadsController = class LeadsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(orgId, user, pipelineId, dto) {
        dto.pipelineId = pipelineId;
        return this.service.create(orgId, user.sub, dto);
    }
    findByPipeline(orgId, pipelineId, statusId, assigneeId, search, limit, cursor) {
        return this.service.findByPipeline(orgId, pipelineId, {
            statusId,
            assigneeId,
            search,
            limit: limit ? parseInt(limit, 10) : undefined,
            cursor,
        });
    }
    findOne(orgId, id) {
        return this.service.findOne(orgId, id);
    }
    update(orgId, id, dto) {
        return this.service.update(orgId, id, dto);
    }
    move(orgId, id, dto) {
        return this.service.move(orgId, id, dto);
    }
    assign(orgId, id, dto) {
        return this.service.assign(orgId, id, dto);
    }
    remove(orgId, id) {
        return this.service.remove(orgId, id);
    }
    bulkMove(orgId, dto) {
        return this.service.bulkMove(orgId, dto);
    }
    bulkAssign(orgId, dto) {
        return this.service.bulkAssign(orgId, dto);
    }
    bulkDelete(orgId, dto) {
        return this.service.bulkDelete(orgId, dto);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Post)('pipelines/:pipelineId/leads'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Param)('pipelineId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, create_lead_dto_1.CreateLeadDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('pipelines/:pipelineId/leads'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('pipelineId')),
    __param(2, (0, common_1.Query)('statusId')),
    __param(3, (0, common_1.Query)('assigneeId')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('limit')),
    __param(6, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findByPipeline", null);
__decorate([
    (0, common_1.Get)('leads/:id'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('leads/:id'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_lead_dto_1.UpdateLeadDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('leads/:id/move'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, move_lead_dto_1.MoveLeadDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "move", null);
__decorate([
    (0, common_1.Patch)('leads/:id/assign'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, assign_lead_dto_1.AssignLeadDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "assign", null);
__decorate([
    (0, common_1.Delete)('leads/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)('leads/bulk/move'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bulk_action_dto_1.BulkMoveDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "bulkMove", null);
__decorate([
    (0, common_1.Patch)('leads/bulk/assign'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bulk_action_dto_1.BulkAssignDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "bulkAssign", null);
__decorate([
    (0, common_1.Patch)('leads/bulk/delete'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bulk_action_dto_1.BulkDeleteDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "bulkDelete", null);
exports.LeadsController = LeadsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [leads_service_1.LeadsService])
], LeadsController);
//# sourceMappingURL=leads.controller.js.map