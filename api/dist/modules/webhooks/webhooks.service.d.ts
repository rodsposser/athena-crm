import { PrismaService } from '../../prisma/prisma.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
export declare class WebhooksService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(orgId: string, dto: CreateWebhookDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        url: string;
        events: import("@prisma/client/runtime/client").JsonValue;
        headers: import("@prisma/client/runtime/client").JsonValue | null;
        secret: string;
        lastTriggeredAt: Date | null;
        failureCount: number;
    }>;
    findAll(orgId: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        url: string;
        events: import("@prisma/client/runtime/client").JsonValue;
        headers: import("@prisma/client/runtime/client").JsonValue | null;
        secret: string;
        lastTriggeredAt: Date | null;
        failureCount: number;
    }[]>;
    findOne(orgId: string, id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        url: string;
        events: import("@prisma/client/runtime/client").JsonValue;
        headers: import("@prisma/client/runtime/client").JsonValue | null;
        secret: string;
        lastTriggeredAt: Date | null;
        failureCount: number;
    }>;
    update(orgId: string, id: string, dto: UpdateWebhookDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        url: string;
        events: import("@prisma/client/runtime/client").JsonValue;
        headers: import("@prisma/client/runtime/client").JsonValue | null;
        secret: string;
        lastTriggeredAt: Date | null;
        failureCount: number;
    }>;
    remove(orgId: string, id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        url: string;
        events: import("@prisma/client/runtime/client").JsonValue;
        headers: import("@prisma/client/runtime/client").JsonValue | null;
        secret: string;
        lastTriggeredAt: Date | null;
        failureCount: number;
    }>;
    deliverEvent(orgId: string, event: string, payload: any): Promise<PromiseSettledResult<void>[]>;
    private deliver;
    testWebhook(orgId: string, webhookId: string): Promise<{
        message: string;
    }>;
    getLogsForWebhook(webhookId: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        executionTimeMs: number;
        event: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        responseStatus: number | null;
        responseBody: string | null;
        success: boolean;
        webhookId: string;
    }[]>;
}
