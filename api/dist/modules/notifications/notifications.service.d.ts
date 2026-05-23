import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType, Prisma } from '@prisma/client';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(orgId: string, recipientId: string, type: NotificationType, title: string, body: string, metadata?: Record<string, unknown>): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        metadata: Prisma.JsonValue;
        body: string;
        isRead: boolean;
        readAt: Date | null;
        recipientId: string;
    }>;
    findByUser(userId: string, cursor?: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        metadata: Prisma.JsonValue;
        body: string;
        isRead: boolean;
        readAt: Date | null;
        recipientId: string;
    }[]>;
    unreadCount(userId: string): Promise<{
        count: number;
    }>;
    markRead(userId: string, notificationId: string): Promise<Prisma.BatchPayload>;
    markAllRead(userId: string): Promise<Prisma.BatchPayload>;
    getPreferences(userId: string): Promise<{
        email: boolean;
        id: string;
        userId: string;
        eventType: import("@prisma/client").$Enums.NotificationType;
        inApp: boolean;
    }[]>;
    updatePreferences(userId: string, eventType: NotificationType, inApp?: boolean, email?: boolean): Promise<{
        email: boolean;
        id: string;
        userId: string;
        eventType: import("@prisma/client").$Enums.NotificationType;
        inApp: boolean;
    }>;
}
