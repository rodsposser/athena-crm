"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InvestmentsService = class InvestmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId, month) {
        return this.prisma.monthlyInvestment.findMany({
            where: {
                organizationId: orgId,
                ...(month ? { month } : {}),
            },
            orderBy: { month: 'desc' },
        });
    }
    async findOne(orgId, id) {
        const record = await this.prisma.monthlyInvestment.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!record)
            throw new common_1.NotFoundException('Investment not found');
        return record;
    }
    async create(orgId, dto) {
        return this.prisma.monthlyInvestment.create({
            data: {
                organizationId: orgId,
                sourceId: dto.sourceId,
                month: dto.month,
                amount: dto.amount,
                description: dto.description,
            },
        });
    }
    async update(orgId, id, dto) {
        await this.findOne(orgId, id);
        return this.prisma.monthlyInvestment.update({
            where: { id },
            data: {
                ...(dto.sourceId !== undefined ? { sourceId: dto.sourceId } : {}),
                ...(dto.month !== undefined ? { month: dto.month } : {}),
                ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
                ...(dto.description !== undefined
                    ? { description: dto.description }
                    : {}),
            },
        });
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        return this.prisma.monthlyInvestment.delete({ where: { id } });
    }
};
exports.InvestmentsService = InvestmentsService;
exports.InvestmentsService = InvestmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvestmentsService);
//# sourceMappingURL=investments.service.js.map