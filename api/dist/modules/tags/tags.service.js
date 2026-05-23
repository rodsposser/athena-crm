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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TagsService = class TagsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId) {
        return this.prisma.tag.findMany({
            where: { organizationId: orgId },
            orderBy: { name: 'asc' },
        });
    }
    async create(orgId, dto) {
        const exists = await this.prisma.tag.findUnique({
            where: { organizationId_name: { organizationId: orgId, name: dto.name } },
        });
        if (exists) {
            throw new common_1.ConflictException('A tag with this name already exists');
        }
        return this.prisma.tag.create({
            data: {
                organizationId: orgId,
                name: dto.name,
                color: dto.color,
            },
        });
    }
    async update(orgId, id, dto) {
        const tag = await this.prisma.tag.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!tag)
            throw new common_1.NotFoundException('Tag not found');
        if (dto.name && dto.name !== tag.name) {
            const duplicate = await this.prisma.tag.findUnique({
                where: { organizationId_name: { organizationId: orgId, name: dto.name } },
            });
            if (duplicate) {
                throw new common_1.ConflictException('A tag with this name already exists');
            }
        }
        return this.prisma.tag.update({
            where: { id },
            data: dto,
        });
    }
    async remove(orgId, id) {
        const tag = await this.prisma.tag.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!tag)
            throw new common_1.NotFoundException('Tag not found');
        await this.prisma.leadTag.deleteMany({ where: { tagId: id } });
        return this.prisma.tag.delete({ where: { id } });
    }
    async addTagToLead(orgId, leadId, tagId) {
        const lead = await this.prisma.lead.findFirst({
            where: { id: leadId, organizationId: orgId, deletedAt: null },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        const tag = await this.prisma.tag.findFirst({
            where: { id: tagId, organizationId: orgId },
        });
        if (!tag)
            throw new common_1.NotFoundException('Tag not found');
        return this.prisma.leadTag.upsert({
            where: { leadId_tagId: { leadId, tagId } },
            update: {},
            create: { leadId, tagId },
            include: { tag: true },
        });
    }
    async removeTagFromLead(orgId, leadId, tagId) {
        const lead = await this.prisma.lead.findFirst({
            where: { id: leadId, organizationId: orgId, deletedAt: null },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        const existing = await this.prisma.leadTag.findUnique({
            where: { leadId_tagId: { leadId, tagId } },
        });
        if (!existing)
            throw new common_1.NotFoundException('Tag not associated with this lead');
        return this.prisma.leadTag.delete({
            where: { leadId_tagId: { leadId, tagId } },
        });
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TagsService);
//# sourceMappingURL=tags.service.js.map