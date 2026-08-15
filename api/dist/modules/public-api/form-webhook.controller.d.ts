import { PrismaService } from '../../prisma/prisma.service';
interface FormPayload {
    event?: string;
    lead?: {
        id?: string;
        name?: string;
        email?: string | null;
        phone?: string | null;
    };
    tracking?: {
        utm_source?: string | null;
        utm_medium?: string | null;
        utm_campaign?: string | null;
    };
    answers_map?: Record<string, string>;
}
export declare class FormWebhookController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    handle(payload: FormPayload): Promise<{
        ok: boolean;
        deduped: boolean;
        leadId?: undefined;
    } | {
        ok: boolean;
        leadId: string;
        deduped?: undefined;
    }>;
}
export {};
