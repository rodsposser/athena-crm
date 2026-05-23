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
exports.PublicApiController = exports.UseApiKey = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const lead_tracking_service_1 = require("../lead-tracking/lead-tracking.service");
const create_public_lead_dto_1 = require("./dto/create-public-lead.dto");
const api_key_guard_1 = require("../../common/guards/api-key.guard");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const UseApiKey = () => (0, common_1.SetMetadata)(api_key_guard_1.USE_API_KEY, true);
exports.UseApiKey = UseApiKey;
let PublicApiController = class PublicApiController {
    prisma;
    trackingService;
    constructor(prisma, trackingService) {
        this.prisma = prisma;
        this.trackingService = trackingService;
    }
    async createLead(dto, req) {
        const orgId = req.user.orgId;
        const defaultStatus = await this.prisma.pipelineStatus.findFirst({
            where: { pipelineId: dto.pipelineId, isDefault: true },
        });
        if (!defaultStatus) {
            throw new common_1.BadRequestException('Pipeline not found or has no default status');
        }
        const maxPos = await this.prisma.lead.aggregate({
            where: { statusId: defaultStatus.id, deletedAt: null },
            _max: { position: true },
        });
        const position = (maxPos._max.position ?? -1) + 1;
        const result = await this.prisma.$transaction(async (tx) => {
            let companyId;
            let contactId;
            if (dto.company) {
                const existing = await tx.company.findFirst({
                    where: { organizationId: orgId, name: dto.company },
                });
                if (existing) {
                    companyId = existing.id;
                }
                else {
                    const created = await tx.company.create({
                        data: { organizationId: orgId, name: dto.company },
                    });
                    companyId = created.id;
                }
            }
            if (dto.email || dto.name) {
                const existingContact = dto.email
                    ? await tx.contact.findFirst({
                        where: { organizationId: orgId, email: dto.email },
                    })
                    : null;
                if (existingContact) {
                    contactId = existingContact.id;
                }
                else {
                    const created = await tx.contact.create({
                        data: {
                            organizationId: orgId,
                            name: dto.name,
                            email: dto.email,
                            phone: dto.phone,
                            companyId,
                        },
                    });
                    contactId = created.id;
                }
            }
            const lead = await tx.lead.create({
                data: {
                    organizationId: orgId,
                    pipelineId: dto.pipelineId,
                    statusId: defaultStatus.id,
                    title: dto.name,
                    contactId,
                    companyId,
                    sourceId: dto.sourceId,
                    position,
                },
                include: {
                    status: true,
                    contact: true,
                    company: true,
                },
            });
            const hasTracking = dto.utm_source ||
                dto.utm_medium ||
                dto.utm_campaign ||
                dto.utm_term ||
                dto.utm_content ||
                dto.referrer_url ||
                dto.landing_page ||
                dto.gclid ||
                dto.fbclid;
            let tracking = null;
            if (hasTracking) {
                tracking = await tx.leadTracking.create({
                    data: {
                        leadId: lead.id,
                        utmSource: dto.utm_source,
                        utmMedium: dto.utm_medium,
                        utmCampaign: dto.utm_campaign,
                        utmTerm: dto.utm_term,
                        utmContent: dto.utm_content,
                        referrerUrl: dto.referrer_url,
                        landingPage: dto.landing_page,
                        gclid: dto.gclid,
                        fbclid: dto.fbclid,
                        ip: req.ip,
                        userAgent: req.headers['user-agent'],
                    },
                });
            }
            return { lead, tracking };
        });
        return result;
    }
};
exports.PublicApiController = PublicApiController;
__decorate([
    (0, common_1.Post)('leads'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_public_lead_dto_1.CreatePublicLeadDto, Object]),
    __metadata("design:returntype", Promise)
], PublicApiController.prototype, "createLead", null);
exports.PublicApiController = PublicApiController = __decorate([
    (0, common_1.Controller)('public/v1'),
    (0, common_1.SetMetadata)(public_decorator_1.IS_PUBLIC_KEY, true),
    (0, exports.UseApiKey)(),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        lead_tracking_service_1.LeadTrackingService])
], PublicApiController);
//# sourceMappingURL=public-api.controller.js.map