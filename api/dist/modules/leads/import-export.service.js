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
exports.ImportExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const sync_1 = require("csv-parse/sync");
const sync_2 = require("csv-stringify/sync");
const COLUMN_MAP = {
    title: 'title',
    titulo: 'title',
    lead: 'title',
    deal: 'title',
    name: 'name',
    nome: 'name',
    contact: 'name',
    contato: 'name',
    contact_name: 'name',
    contactname: 'name',
    email: 'email',
    'e-mail': 'email',
    contact_email: 'email',
    phone: 'phone',
    telefone: 'phone',
    tel: 'phone',
    celular: 'phone',
    contact_phone: 'phone',
    company: 'company',
    empresa: 'company',
    company_name: 'company',
    companyname: 'company',
    value: 'value',
    valor: 'value',
    estimated_value: 'value',
    estimatedvalue: 'value',
};
let ImportExportService = class ImportExportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async importCsv(orgId, userId, pipelineId, fileBuffer) {
        const pipeline = await this.prisma.pipeline.findFirst({
            where: { id: pipelineId, organizationId: orgId, deletedAt: null },
        });
        if (!pipeline) {
            throw new common_1.BadRequestException('Pipeline not found');
        }
        const defaultStatus = await this.prisma.pipelineStatus.findFirst({
            where: { pipelineId, isDefault: true },
        });
        if (!defaultStatus) {
            throw new common_1.BadRequestException('Pipeline has no default status');
        }
        let records;
        try {
            records = (0, sync_1.parse)(fileBuffer, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
                bom: true,
                relaxColumnCount: true,
            });
        }
        catch {
            throw new common_1.BadRequestException('Failed to parse CSV file. Please check the format.');
        }
        if (records.length === 0) {
            throw new common_1.BadRequestException('CSV file is empty');
        }
        const headers = Object.keys(records[0]);
        const fieldMapping = {};
        for (const header of headers) {
            const normalized = header.toLowerCase().trim().replace(/[\s_-]+/g, '_');
            const mapped = COLUMN_MAP[normalized] || COLUMN_MAP[normalized.replace(/_/g, '')];
            if (mapped) {
                fieldMapping[header] = mapped;
            }
        }
        const maxPos = await this.prisma.lead.aggregate({
            where: { statusId: defaultStatus.id, deletedAt: null },
            _max: { position: true },
        });
        let nextPosition = (maxPos._max.position ?? -1) + 1;
        const result = { imported: 0, skipped: 0, errors: [] };
        for (let i = 0; i < records.length; i++) {
            const row = records[i];
            const rowNum = i + 2;
            try {
                const fields = this.extractFields(row, fieldMapping);
                if (!fields.title && !fields.name) {
                    result.errors.push({
                        row: rowNum,
                        message: 'Missing title or name',
                    });
                    result.skipped++;
                    continue;
                }
                const title = fields.title || fields.name;
                let companyId;
                if (fields.company) {
                    const company = await this.prisma.company.findFirst({
                        where: { organizationId: orgId, name: fields.company },
                    });
                    if (company) {
                        companyId = company.id;
                    }
                    else {
                        const created = await this.prisma.company.create({
                            data: { organizationId: orgId, name: fields.company },
                        });
                        companyId = created.id;
                    }
                }
                let contactId;
                if (fields.email || fields.name || fields.phone) {
                    let contact = fields.email
                        ? await this.prisma.contact.findFirst({
                            where: { organizationId: orgId, email: fields.email },
                        })
                        : null;
                    if (!contact) {
                        contact = await this.prisma.contact.create({
                            data: {
                                organizationId: orgId,
                                name: fields.name || fields.email || 'Sem nome',
                                email: fields.email || undefined,
                                phone: fields.phone || undefined,
                                companyId,
                            },
                        });
                    }
                    contactId = contact.id;
                }
                const estimatedValue = fields.value
                    ? Math.round(parseFloat(fields.value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0)
                    : 0;
                await this.prisma.lead.create({
                    data: {
                        organizationId: orgId,
                        pipelineId,
                        statusId: defaultStatus.id,
                        title,
                        estimatedValue,
                        contactId,
                        companyId,
                        position: nextPosition++,
                    },
                });
                result.imported++;
            }
            catch (err) {
                result.errors.push({
                    row: rowNum,
                    message: err.message || 'Unknown error',
                });
                result.skipped++;
            }
        }
        return result;
    }
    extractFields(row, fieldMapping) {
        const fields = {};
        for (const [header, canonical] of Object.entries(fieldMapping)) {
            const val = row[header]?.trim();
            if (val) {
                if (!fields[canonical]) {
                    fields[canonical] = val;
                }
            }
        }
        return fields;
    }
    async exportCsv(orgId, filters) {
        const where = {
            organizationId: orgId,
            deletedAt: null,
        };
        if (filters.pipelineId)
            where.pipelineId = filters.pipelineId;
        if (filters.statusId)
            where.statusId = filters.statusId;
        const leads = await this.prisma.lead.findMany({
            where,
            include: {
                contact: { select: { name: true, email: true, phone: true } },
                company: { select: { name: true } },
                status: { select: { name: true } },
                assignee: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        const rows = leads.map((lead) => ({
            title: lead.title,
            'contact.name': lead.contact?.name || '',
            'contact.email': lead.contact?.email || '',
            'contact.phone': lead.contact?.phone || '',
            'company.name': lead.company?.name || '',
            estimatedValue: lead.estimatedValue,
            'status.name': lead.status?.name || '',
            'assignee.name': lead.assignee?.name || '',
            priority: lead.priority,
            temperature: lead.temperature,
            createdAt: lead.createdAt.toISOString(),
        }));
        return (0, sync_2.stringify)(rows, {
            header: true,
            columns: [
                { key: 'title', header: 'Title' },
                { key: 'contact.name', header: 'Contact Name' },
                { key: 'contact.email', header: 'Contact Email' },
                { key: 'contact.phone', header: 'Contact Phone' },
                { key: 'company.name', header: 'Company' },
                { key: 'estimatedValue', header: 'Estimated Value' },
                { key: 'status.name', header: 'Status' },
                { key: 'assignee.name', header: 'Assignee' },
                { key: 'priority', header: 'Priority' },
                { key: 'temperature', header: 'Temperature' },
                { key: 'createdAt', header: 'Created At' },
            ],
        });
    }
};
exports.ImportExportService = ImportExportService;
exports.ImportExportService = ImportExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImportExportService);
//# sourceMappingURL=import-export.service.js.map