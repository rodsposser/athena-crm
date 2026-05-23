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
exports.ImportExportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const import_export_service_1 = require("./import-export.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ImportExportController = class ImportExportController {
    importExportService;
    constructor(importExportService) {
        this.importExportService = importExportService;
    }
    async importLeads(orgId, user, file, pipelineId) {
        if (!file) {
            throw new common_1.BadRequestException('CSV file is required');
        }
        if (!pipelineId) {
            throw new common_1.BadRequestException('pipelineId query parameter is required');
        }
        return this.importExportService.importCsv(orgId, user.sub, pipelineId, file.buffer);
    }
    async exportLeads(orgId, pipelineId, statusId, format, res) {
        if (format && format !== 'csv') {
            throw new common_1.BadRequestException('Only CSV format is supported');
        }
        const csv = await this.importExportService.exportCsv(orgId, {
            pipelineId,
            statusId,
        });
        const filename = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });
        res.send(csv);
    }
};
exports.ImportExportController = ImportExportController;
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            if (file.mimetype === 'text/csv' ||
                file.mimetype === 'application/vnd.ms-excel' ||
                file.originalname.endsWith('.csv')) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Only CSV files are accepted'), false);
            }
        },
    })),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Query)('pipelineId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String]),
    __metadata("design:returntype", Promise)
], ImportExportController.prototype, "importLeads", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, current_user_decorator_1.CurrentOrg)()),
    __param(1, (0, common_1.Query)('pipelineId')),
    __param(2, (0, common_1.Query)('statusId')),
    __param(3, (0, common_1.Query)('format')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ImportExportController.prototype, "exportLeads", null);
exports.ImportExportController = ImportExportController = __decorate([
    (0, common_1.Controller)('leads'),
    __metadata("design:paramtypes", [import_export_service_1.ImportExportService])
], ImportExportController);
//# sourceMappingURL=import-export.controller.js.map