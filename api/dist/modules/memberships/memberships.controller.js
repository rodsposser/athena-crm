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
exports.MembershipsController = void 0;
const common_1 = require("@nestjs/common");
const memberships_service_1 = require("./memberships.service");
const invite_member_dto_1 = require("./dto/invite-member.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let MembershipsController = class MembershipsController {
    service;
    constructor(service) {
        this.service = service;
    }
    listMembers(orgId) {
        return this.service.listMembers(orgId);
    }
    invite(orgId, user, dto) {
        return this.service.inviteMember(orgId, user.sub, dto.email, dto.role);
    }
    listInvitations(orgId) {
        return this.service.listInvitations(orgId);
    }
    acceptInvite(body) {
        return this.service.acceptInvite(body.token, body.name, body.password);
    }
    updateRole(orgId, id, dto) {
        return this.service.updateRole(orgId, id, dto.role);
    }
    removeMember(orgId, id) {
        return this.service.removeMember(orgId, id);
    }
};
exports.MembershipsController = MembershipsController;
__decorate([
    (0, common_1.Get)('members'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "listMembers", null);
__decorate([
    (0, common_1.Post)('invitations'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, invite_member_dto_1.InviteMemberDto]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "invite", null);
__decorate([
    (0, common_1.Get)('invitations'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "listInvitations", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('invitations/accept'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "acceptInvite", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Patch)('members/:id/role'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "updateRole", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Delete)('members/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "removeMember", null);
exports.MembershipsController = MembershipsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [memberships_service_1.MembershipsService])
], MembershipsController);
//# sourceMappingURL=memberships.controller.js.map