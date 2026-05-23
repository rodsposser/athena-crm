import { PrismaService } from '../../prisma/prisma.service';
import { ActivityType, Prisma } from '@prisma/client';
export declare class ActivitiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    logActivity(leadId: string, userId: string | null, type: ActivityType, metadata?: Prisma.InputJsonValue): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        leadId: string;
        type: import("@prisma/client").$Enums.ActivityType;
        metadata: Prisma.JsonValue;
    }>;
    getByLead(orgId: string, leadId: string, cursor?: string, limit?: number): Promise<({
        user: {
            name: string;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        leadId: string;
        type: import("@prisma/client").$Enums.ActivityType;
        metadata: Prisma.JsonValue;
    })[]>;
}
