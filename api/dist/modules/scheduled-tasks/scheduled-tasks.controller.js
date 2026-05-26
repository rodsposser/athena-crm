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
exports.ScheduledTasksController = void 0;
const common_1 = require("@nestjs/common");
const scheduled_tasks_service_1 = require("./scheduled-tasks.service");
const create_scheduled_task_dto_1 = require("./dto/create-scheduled-task.dto");
const complete_scheduled_task_dto_1 = require("./dto/complete-scheduled-task.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ScheduledTasksController = class ScheduledTasksController {
    service;
    constructor(service) {
        this.service = service;
    }
    findByPeriod(orgId, dateFrom, dateTo) {
        return this.service.findByPeriod(orgId, dateFrom, dateTo);
    }
    findMetrics(orgId, date) {
        return this.service.findMetrics(orgId, date || new Date().toISOString().slice(0, 10));
    }
    searchLeads(orgId, query) {
        return this.service.searchLeads(orgId, query || '');
    }
    create(orgId, user, dto) {
        return this.service.create(orgId, user.sub, dto);
    }
    complete(orgId, id, dto) {
        return this.service.complete(orgId, id, dto);
    }
    cancel(orgId, id) {
        return this.service.cancel(orgId, id);
    }
    remove(orgId, id) {
        return this.service.remove(orgId, id);
    }
};
exports.ScheduledTasksController = ScheduledTasksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ScheduledTasksController.prototype, "findByPeriod", null);
__decorate([
    (0, common_1.Get)('metrics'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ScheduledTasksController.prototype, "findMetrics", null);
__decorate([
    (0, common_1.Get)('leads/search'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ScheduledTasksController.prototype, "searchLeads", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_scheduled_task_dto_1.CreateScheduledTaskDto]),
    __metadata("design:returntype", void 0)
], ScheduledTasksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, complete_scheduled_task_dto_1.CompleteScheduledTaskDto]),
    __metadata("design:returntype", void 0)
], ScheduledTasksController.prototype, "complete", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ScheduledTasksController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ScheduledTasksController.prototype, "remove", null);
exports.ScheduledTasksController = ScheduledTasksController = __decorate([
    (0, common_1.Controller)('scheduled-tasks'),
    __metadata("design:paramtypes", [scheduled_tasks_service_1.ScheduledTasksService])
], ScheduledTasksController);
//# sourceMappingURL=scheduled-tasks.controller.js.map