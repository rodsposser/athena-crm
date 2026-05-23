import { PrismaService } from '../../prisma/prisma.service';
interface CreateTrackingData {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    referrerUrl?: string;
    landingPage?: string;
    gclid?: string;
    fbclid?: string;
    ip?: string;
    userAgent?: string;
}
export declare class LeadTrackingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(leadId: string, data: CreateTrackingData): Promise<{
        id: string;
        createdAt: Date;
        leadId: string;
        utmSource: string | null;
        utmMedium: string | null;
        utmCampaign: string | null;
        utmTerm: string | null;
        utmContent: string | null;
        referrerUrl: string | null;
        landingPage: string | null;
        gclid: string | null;
        fbclid: string | null;
        ip: string | null;
        userAgent: string | null;
    }>;
    findByLead(leadId: string): Promise<{
        id: string;
        createdAt: Date;
        leadId: string;
        utmSource: string | null;
        utmMedium: string | null;
        utmCampaign: string | null;
        utmTerm: string | null;
        utmContent: string | null;
        referrerUrl: string | null;
        landingPage: string | null;
        gclid: string | null;
        fbclid: string | null;
        ip: string | null;
        userAgent: string | null;
    } | null>;
}
export {};
