"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const pipelines_module_1 = require("./modules/pipelines/pipelines.module");
const leads_module_1 = require("./modules/leads/leads.module");
const custom_fields_module_1 = require("./modules/custom-fields/custom-fields.module");
const tags_module_1 = require("./modules/tags/tags.module");
const lead_sources_module_1 = require("./modules/lead-sources/lead-sources.module");
const activities_module_1 = require("./modules/activities/activities.module");
const notes_module_1 = require("./modules/notes/notes.module");
const lead_tasks_module_1 = require("./modules/lead-tasks/lead-tasks.module");
const memberships_module_1 = require("./modules/memberships/memberships.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const automations_module_1 = require("./modules/automations/automations.module");
const lead_scoring_module_1 = require("./modules/lead-scoring/lead-scoring.module");
const investments_module_1 = require("./modules/investments/investments.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const webhooks_module_1 = require("./modules/webhooks/webhooks.module");
const api_keys_module_1 = require("./modules/api-keys/api-keys.module");
const lead_tracking_module_1 = require("./modules/lead-tracking/lead-tracking.module");
const public_api_module_1 = require("./modules/public-api/public-api.module");
const scheduled_tasks_module_1 = require("./modules/scheduled-tasks/scheduled-tasks.module");
const env_validation_1 = require("./common/config/env.validation");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const org_member_guard_1 = require("./common/guards/org-member.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const health_controller_1 = require("./health.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: env_validation_1.validateEnv,
            }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
            jwt_1.JwtModule.register({}),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            pipelines_module_1.PipelinesModule,
            leads_module_1.LeadsModule,
            custom_fields_module_1.CustomFieldsModule,
            tags_module_1.TagsModule,
            lead_sources_module_1.LeadSourcesModule,
            activities_module_1.ActivitiesModule,
            notes_module_1.NotesModule,
            lead_tasks_module_1.LeadTasksModule,
            memberships_module_1.MembershipsModule,
            notifications_module_1.NotificationsModule,
            automations_module_1.AutomationsModule,
            lead_scoring_module_1.LeadScoringModule,
            investments_module_1.InvestmentsModule,
            dashboard_module_1.DashboardModule,
            webhooks_module_1.WebhooksModule,
            api_keys_module_1.ApiKeysModule,
            lead_tracking_module_1.LeadTrackingModule,
            public_api_module_1.PublicApiModule,
            scheduled_tasks_module_1.ScheduledTasksModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: org_member_guard_1.OrgMemberGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map