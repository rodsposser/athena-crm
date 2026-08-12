import { PrismaService } from '../../prisma/prisma.service';
export declare class WebhookDebugController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    capture(body: unknown, headers: unknown, query: unknown): Promise<{
        ok: boolean;
    }>;
    verify(query: unknown, req: any): Promise<{
        ok: boolean;
    }>;
}
