import { NotificationsService } from './notifications.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
export declare class NotificationsController {
    private readonly service;
    constructor(service: NotificationsService);
    findAll(userId: string, cursor?: string, limit?: string): Promise<{
        id: string;
        createdAt: Date;
        organizationId: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        body: string;
        isRead: boolean;
        readAt: Date | null;
        recipientId: string;
    }[]>;
    unreadCount(userId: string): Promise<{
        count: number;
    }>;
    markRead(userId: string, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getPreferences(userId: string): Promise<{
        email: boolean;
        id: string;
        userId: string;
        eventType: import("@prisma/client").$Enums.NotificationType;
        inApp: boolean;
    }[]>;
    updatePreferences(userId: string, dto: UpdatePreferenceDto): Promise<{
        email: boolean;
        id: string;
        userId: string;
        eventType: import("@prisma/client").$Enums.NotificationType;
        inApp: boolean;
    }>;
}
