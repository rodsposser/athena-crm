import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvestmentDto, UpdateInvestmentDto } from './dto/create-investment.dto';
export declare class InvestmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string, month?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        sourceId: string | null;
        month: string;
        amount: number;
    }[]>;
    findOne(orgId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        sourceId: string | null;
        month: string;
        amount: number;
    }>;
    create(orgId: string, dto: CreateInvestmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        sourceId: string | null;
        month: string;
        amount: number;
    }>;
    update(orgId: string, id: string, dto: UpdateInvestmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        sourceId: string | null;
        month: string;
        amount: number;
    }>;
    remove(orgId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        sourceId: string | null;
        month: string;
        amount: number;
    }>;
}
