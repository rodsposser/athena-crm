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
exports.CreateScoringRuleDto = exports.RuleConditionDto = exports.ConditionOperator = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var ConditionOperator;
(function (ConditionOperator) {
    ConditionOperator["EQUALS"] = "EQUALS";
    ConditionOperator["NOT_EQUALS"] = "NOT_EQUALS";
    ConditionOperator["GREATER_THAN"] = "GREATER_THAN";
    ConditionOperator["LESS_THAN"] = "LESS_THAN";
    ConditionOperator["CONTAINS"] = "CONTAINS";
    ConditionOperator["IS_SET"] = "IS_SET";
    ConditionOperator["IS_NOT_SET"] = "IS_NOT_SET";
})(ConditionOperator || (exports.ConditionOperator = ConditionOperator = {}));
class RuleConditionDto {
    field;
    operator;
    value;
}
exports.RuleConditionDto = RuleConditionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RuleConditionDto.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ConditionOperator),
    __metadata("design:type", String)
], RuleConditionDto.prototype, "operator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], RuleConditionDto.prototype, "value", void 0);
class CreateScoringRuleDto {
    name;
    condition;
    points;
    isActive;
}
exports.CreateScoringRuleDto = CreateScoringRuleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateScoringRuleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RuleConditionDto),
    __metadata("design:type", RuleConditionDto)
], CreateScoringRuleDto.prototype, "condition", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateScoringRuleDto.prototype, "points", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateScoringRuleDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-scoring-rule.dto.js.map