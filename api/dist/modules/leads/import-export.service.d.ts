import { PrismaService } from '../../prisma/prisma.service';
interface ImportError {
    row: number;
    message: string;
}
export interface ImportResult {
    imported: number;
    skipped: number;
    errors: ImportError[];
}
export declare class ImportExportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    importCsv(orgId: string, userId: string, pipelineId: string, fileBuffer: Buffer): Promise<ImportResult>;
    private extractFields;
    exportCsv(orgId: string, filters: {
        pipelineId?: string;
        statusId?: string;
    }): Promise<string>;
}
export {};
