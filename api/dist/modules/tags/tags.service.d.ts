import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        color: string;
    }[]>;
    create(orgId: string, dto: CreateTagDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        color: string;
    }>;
    update(orgId: string, id: string, dto: UpdateTagDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        color: string;
    }>;
    remove(orgId: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        color: string;
    }>;
    addTagToLead(orgId: string, leadId: string, tagId: string): Promise<{
        tag: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            color: string;
        };
    } & {
        createdAt: Date;
        leadId: string;
        tagId: string;
    }>;
    removeTagFromLead(orgId: string, leadId: string, tagId: string): Promise<{
        createdAt: Date;
        leadId: string;
        tagId: string;
    }>;
}
