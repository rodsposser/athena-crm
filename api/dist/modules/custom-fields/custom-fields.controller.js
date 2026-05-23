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
exports.CustomFieldsController = void 0;
const common_1 = require("@nestjs/common");
const custom_fields_service_1 = require("./custom-fields.service");
const create_field_definition_dto_1 = require("./dto/create-field-definition.dto");
const update_field_definition_dto_1 = require("./dto/update-field-definition.dto");
const set_field_values_dto_1 = require("./dto/set-field-values.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CustomFieldsController = class CustomFieldsController {
    service;
    constructor(service) {
        this.service = service;
    }
    listDefinitions(_orgId, pipelineId) {
        return this.service.listDefinitions(pipelineId);
    }
    createDefinition(_orgId, pipelineId, dto) {
        return this.service.createDefinition(pipelineId, dto);
    }
    updateDefinition(_orgId, id, dto) {
        return this.service.updateDefinition(id, dto);
    }
    deleteDefinition(_orgId, id) {
        return this.service.deleteDefinition(id);
    }
    setValues(_orgId, leadId, dto) {
        return this.service.setValues(leadId, dto.values);
    }
    getValues(_orgId, leadId) {
        return this.service.getValues(leadId);
    }
};
exports.CustomFieldsController = CustomFieldsController;
__decorate([
    (0, common_1.Get)('pipelines/:pipelineId/custom-fields'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('pipelineId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CustomFieldsController.prototype, "listDefinitions", null);
__decorate([
    (0, common_1.Post)('pipelines/:pipelineId/custom-fields'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('pipelineId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_field_definition_dto_1.CreateFieldDefinitionDto]),
    __metadata("design:returntype", void 0)
], CustomFieldsController.prototype, "createDefinition", null);
__decorate([
    (0, common_1.Patch)('custom-fields/:id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_field_definition_dto_1.UpdateFieldDefinitionDto]),
    __metadata("design:returntype", void 0)
], CustomFieldsController.prototype, "updateDefinition", null);
__decorate([
    (0, common_1.Delete)('custom-fields/:id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CustomFieldsController.prototype, "deleteDefinition", null);
__decorate([
    (0, common_1.Put)('leads/:leadId/custom-fields'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('leadId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, set_field_values_dto_1.SetFieldValuesDto]),
    __metadata("design:returntype", void 0)
], CustomFieldsController.prototype, "setValues", null);
__decorate([
    (0, common_1.Get)('leads/:leadId/custom-fields'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('leadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CustomFieldsController.prototype, "getValues", null);
exports.CustomFieldsController = CustomFieldsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [custom_fields_service_1.CustomFieldsService])
], CustomFieldsController);
//# sourceMappingURL=custom-fields.controller.js.map