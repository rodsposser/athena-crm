import { PrismaService } from '../../prisma/prisma.service';
import { LeadTrackingService } from '../lead-tracking/lead-tracking.service';
import { CreatePublicLeadDto } from './dto/create-public-lead.dto';
export declare const UseApiKey: () => import("@nestjs/common").CustomDecorator<string>;
export declare class PublicApiController {
    private readonly prisma;
    private readonly trackingService;
    constructor(prisma: PrismaService, trackingService: LeadTrackingService);
    createLead(dto: CreatePublicLeadDto, req: any): Promise<{
        lead: {
            company: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                organizationId: string;
                domain: string | null;
                industry: string | null;
                website: string | null;
            } | null;
            contact: {
                name: string;
                email: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                organizationId: string;
                companyId: string | null;
                phone: string | null;
                jobTitle: string | null;
            } | null;
            status: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                color: string;
                isFinal: boolean;
                isWon: boolean;
                isMql: boolean;
                isMeeting: boolean;
                staleAfterDays: number | null;
                isDefault: boolean;
                position: number;
                pipelineId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            position: number;
            pipelineId: string;
            statusId: string;
            title: string;
            estimatedValue: number;
            priority: import("@prisma/client").$Enums.LeadPriority;
            temperature: import("@prisma/client").$Enums.LeadTemperature;
            assigneeId: string | null;
            probability: number | null;
            expectedCloseDate: Date | null;
            lostReason: string | null;
            version: number;
            contactId: string | null;
            companyId: string | null;
            wonAt: Date | null;
            lostAt: Date | null;
            lastActivityAt: Date;
            lastStatusChangedAt: Date;
            sourceId: string | null;
        };
        tracking: {
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
        } | null;
    }>;
}
