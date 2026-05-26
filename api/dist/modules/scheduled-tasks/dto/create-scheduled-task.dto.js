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
exports.CreateScheduledTaskDto = exports.ScheduledTaskType = void 0;
const class_validator_1 = require("class-validator");
var ScheduledTaskType;
(function (ScheduledTaskType) {
    ScheduledTaskType["CALL"] = "CALL";
    ScheduledTaskType["MEETING"] = "MEETING";
    ScheduledTaskType["CALLBACK"] = "CALLBACK";
    ScheduledTaskType["EMAIL"] = "EMAIL";
})(ScheduledTaskType || (exports.ScheduledTaskType = ScheduledTaskType = {}));
class CreateScheduledTaskDto {
    leadId;
    type;
    scheduledAt;
    notes;
}
exports.CreateScheduledTaskDto = CreateScheduledTaskDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "leadId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ScheduledTaskType),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "notes", void 0);
//# sourceMappingURL=create-scheduled-task.dto.js.map