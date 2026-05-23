import { PrismaService } from '../../prisma/prisma.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
export declare class ApiKeysService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private hashKey;
    create(orgId: string, userId: string, dto: CreateApiKeyDto): Promise<{
        id: string;
        name: string;
        key: string;
        prefix: string;
        scopes: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
    }>;
    findAll(orgId: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        expiresAt: Date | null;
        scopes: import("@prisma/client/runtime/client").JsonValue;
        prefix: string;
        lastUsedAt: Date | null;
    }[]>;
    revoke(orgId: string, id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        organizationId: string;
        createdBy: string;
        expiresAt: Date | null;
        scopes: import("@prisma/client/runtime/client").JsonValue;
        keyHash: string;
        prefix: string;
        lastUsedAt: Date | null;
    }>;
    validateKey(rawKey: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        organizationId: string;
        createdBy: string;
        expiresAt: Date | null;
        scopes: import("@prisma/client/runtime/client").JsonValue;
        keyHash: string;
        prefix: string;
        lastUsedAt: Date | null;
    } | null>;
}
