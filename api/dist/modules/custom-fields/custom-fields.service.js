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
exports.CustomFieldsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CustomFieldsService = class CustomFieldsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async listDefinitions(pipelineId) {
        return this.prisma.customFieldDefinition.findMany({
            where: { pipelineId },
            orderBy: { position: 'asc' },
        });
    }
    async createDefinition(pipelineId, dto) {
        if ((dto.type === client_1.CustomFieldType.SELECT ||
            dto.type === client_1.CustomFieldType.MULTI_SELECT) &&
            (!dto.options || !Array.isArray(dto.options) || dto.options.length === 0)) {
            throw new common_1.BadRequestException('options array is required for SELECT/MULTI_SELECT fields');
        }
        const slug = this.generateSlug(dto.name);
        return this.prisma.customFieldDefinition.create({
            data: {
                pipelineId,
                name: dto.name,
                slug,
                type: dto.type,
                options: dto.options ?? undefined,
                defaultValue: dto.defaultValue,
                isRequired: dto.isRequired ?? false,
                isVisibleOnCard: dto.isVisibleOnCard ?? false,
                isFilterable: dto.isFilterable ?? true,
                position: dto.position ?? 0,
                validationRules: dto.validationRules ?? undefined,
            },
        });
    }
    async updateDefinition(id, dto) {
        const existing = await this.prisma.customFieldDefinition.findUnique({
            where: { id },
        });
        if (!existing)
            throw new common_1.NotFoundException('Field definition not found');
        const type = dto.type ?? existing.type;
        if ((type === client_1.CustomFieldType.SELECT ||
            type === client_1.CustomFieldType.MULTI_SELECT) &&
            dto.options !== undefined &&
            (!Array.isArray(dto.options) || dto.options.length === 0)) {
            throw new common_1.BadRequestException('options array is required for SELECT/MULTI_SELECT fields');
        }
        const data = { ...dto };
        if (dto.name) {
            data.slug = this.generateSlug(dto.name);
        }
        return this.prisma.customFieldDefinition.update({
            where: { id },
            data,
        });
    }
    async deleteDefinition(id) {
        const existing = await this.prisma.customFieldDefinition.findUnique({
            where: { id },
        });
        if (!existing)
            throw new common_1.NotFoundException('Field definition not found');
        await this.prisma.$transaction([
            this.prisma.customFieldValue.deleteMany({
                where: { fieldDefinitionId: id },
            }),
            this.prisma.customFieldDefinition.delete({ where: { id } }),
        ]);
        return { deleted: true };
    }
    async setValues(leadId, items) {
        const fieldIds = items.map((i) => i.fieldDefinitionId);
        const definitions = await this.prisma.customFieldDefinition.findMany({
            where: { id: { in: fieldIds } },
        });
        const defMap = new Map(definitions.map((d) => [d.id, d]));
        const upserts = items.map((item) => {
            const def = defMap.get(item.fieldDefinitionId);
            if (!def) {
                throw new common_1.BadRequestException(`Field definition ${item.fieldDefinitionId} not found`);
            }
            const columns = this.resolveValueColumns(def.type, item.value);
            return this.prisma.customFieldValue.upsert({
                where: {
                    leadId_fieldDefinitionId: {
                        leadId,
                        fieldDefinitionId: item.fieldDefinitionId,
                    },
                },
                create: {
                    leadId,
                    fieldDefinitionId: item.fieldDefinitionId,
                    ...columns,
                },
                update: columns,
            });
        });
        return this.prisma.$transaction(upserts);
    }
    async getValues(leadId) {
        return this.prisma.customFieldValue.findMany({
            where: { leadId },
            include: { fieldDefinition: true },
        });
    }
    resolveValueColumns(type, value) {
        const base = {
            textValue: null,
            numberValue: null,
            dateValue: null,
            booleanValue: null,
            jsonValue: null,
        };
        if (value === null || value === undefined) {
            return base;
        }
        switch (type) {
            case client_1.CustomFieldType.TEXT:
            case client_1.CustomFieldType.TEXTAREA:
            case client_1.CustomFieldType.URL:
            case client_1.CustomFieldType.PHONE:
            case client_1.CustomFieldType.EMAIL:
            case client_1.CustomFieldType.SELECT:
                return { ...base, textValue: String(value) };
            case client_1.CustomFieldType.NUMBER:
            case client_1.CustomFieldType.CURRENCY:
            case client_1.CustomFieldType.RATING:
            case client_1.CustomFieldType.PERCENTAGE:
                return { ...base, numberValue: Number(value) };
            case client_1.CustomFieldType.DATE:
            case client_1.CustomFieldType.DATETIME:
                return { ...base, dateValue: new Date(value) };
            case client_1.CustomFieldType.CHECKBOX:
                return { ...base, booleanValue: Boolean(value) };
            case client_1.CustomFieldType.MULTI_SELECT:
                return { ...base, jsonValue: value };
            default:
                return { ...base, textValue: String(value) };
        }
    }
};
exports.CustomFieldsService = CustomFieldsService;
exports.CustomFieldsService = CustomFieldsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomFieldsService);
//# sourceMappingURL=custom-fields.service.js.map