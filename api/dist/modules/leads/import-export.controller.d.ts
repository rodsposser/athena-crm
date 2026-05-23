import type { Response } from 'express';
import { ImportExportService } from './import-export.service';
import type { JwtUser } from '../../common/decorators/current-user.decorator';
export declare class ImportExportController {
    private readonly importExportService;
    constructor(importExportService: ImportExportService);
    importLeads(orgId: string, user: JwtUser, file: Express.Multer.File, pipelineId: string): Promise<import("./import-export.service").ImportResult>;
    exportLeads(orgId: string, pipelineId?: string, statusId?: string, format?: string, res?: Response): Promise<void>;
}
