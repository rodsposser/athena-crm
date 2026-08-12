import { PrismaService } from '../../prisma/prisma.service';
interface BookingPayload {
    event?: string;
    booking?: {
        id?: string;
        name?: string;
        email?: string;
        phone?: string;
        notes?: string | null;
        scheduled_at?: string;
        scheduled_end_at?: string;
        utm_source?: string | null;
        utm_medium?: string | null;
        utm_campaign?: string | null;
    };
}
export declare class SchedulingWebhookController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    handle(payload: BookingPayload): Promise<{
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
