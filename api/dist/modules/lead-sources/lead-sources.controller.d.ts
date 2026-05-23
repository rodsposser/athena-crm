import { LeadSourcesService } from './lead-sources.service';
import { CreateLeadSourceDto } from './dto/create-lead-source.dto';
import { UpdateLeadSourceDto } from './dto/update-lead-source.dto';
export declare class LeadSourcesController {
    private readonly service;
    constructor(service: LeadSourcesService);
    findAll(orgId: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        color: string;
        isDefault: boolean;
        type: import("@prisma/client").$Enums.LeadSourceType;
        icon: string | null;
    }[]>;
    report(orgId: string): Promise<{
        source: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            color: string;
            isDefault: boolean;
            type: import("@prisma/client").$Enums.LeadSourceType;
            icon: string | null;
        } | null;
        leadsCount: number;
        totalEstimatedValue: number;
    }[]>;
    create(orgId: string, dto: CreateLeadSourceDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        color: string;
        isDefault: boolean;
        type: import("@prisma/client").$Enums.LeadSourceType;
        icon: string | null;
    }>;
    update(orgId: string, id: string, dto: UpdateLeadSourceDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        color: string;
        isDefault: boolean;
        type: import("@prisma/client").$Enums.LeadSourceType;
        icon: string | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        color: string;
        isDefault: boolean;
        type: import("@prisma/client").$Enums.LeadSourceType;
        icon: string | null;
    }>;
}
