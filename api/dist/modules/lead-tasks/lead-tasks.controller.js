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
exports.LeadTasksController = void 0;
const common_1 = require("@nestjs/common");
const lead_tasks_service_1 = require("./lead-tasks.service");
const create_lead_task_dto_1 = require("./dto/create-lead-task.dto");
const update_lead_task_dto_1 = require("./dto/update-lead-task.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let LeadTasksController = class LeadTasksController {
    service;
    constructor(service) {
        this.service = service;
    }
    findByLead(leadId) {
        return this.service.findByLead(leadId);
    }
    findMine(userId, status) {
        return this.service.findMine(userId, status);
    }
    create(userId, leadId, dto) {
        return this.service.create(leadId, userId, dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    complete(id) {
        return this.service.complete(id);
    }
};
exports.LeadTasksController = LeadTasksController;
__decorate([
    (0, common_1.Get)('leads/:leadId/tasks'),
    __param(0, (0, common_1.Param)('leadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadTasksController.prototype, "findByLead", null);
__decorate([
    (0, common_1.Get)('tasks/mine'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LeadTasksController.prototype, "findMine", null);
__decorate([
    (0, common_1.Post)('leads/:leadId/tasks'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Param)('leadId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_lead_task_dto_1.CreateLeadTaskDto]),
    __metadata("design:returntype", void 0)
], LeadTasksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lead_task_dto_1.UpdateLeadTaskDto]),
    __metadata("design:returntype", void 0)
], LeadTasksController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('tasks/:id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadTasksController.prototype, "complete", null);
exports.LeadTasksController = LeadTasksController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [lead_tasks_service_1.LeadTasksService])
], LeadTasksController);
//# sourceMappingURL=lead-tasks.controller.js.map