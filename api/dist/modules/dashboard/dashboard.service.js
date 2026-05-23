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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getKpis(orgId, pipelineId, dateFrom, dateTo) {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const pipelineFilter = pipelineId ? { pipelineId } : {};
        const dateFilter = this.buildDateFilter(dateFrom, dateTo);
        const statuses = await this.prisma.pipelineStatus.findMany({
            where: {
                pipeline: { organizationId: orgId },
                ...(pipelineId ? { pipelineId } : {}),
            },
        });
        const mqls = statuses.filter((s) => s.isMql).map((s) => s.id);
        const meetings = statuses.filter((s) => s.isMeeting).map((s) => s.id);
        const finals = statuses.filter((s) => s.isFinal).map((s) => s.id);
        const wons = statuses
            .filter((s) => s.isFinal && s.isWon)
            .map((s) => s.id);
        const disqualifiedIds = statuses
            .filter((s) => s.isFinal && !s.isWon)
            .map((s) => s.id);
        const baseWhere = {
            organizationId: orgId,
            deletedAt: null,
            ...pipelineFilter,
        };
        const dateUpper = dateFilter.createdAt
            ? { ...(dateFilter.createdAt.lt ? { lt: dateFilter.createdAt.lt } : {}),
                ...(dateFilter.createdAt.lte ? { lte: dateFilter.createdAt.lte } : {}) }
            : {};
        const [leadsToday, leadsMonth, mqlCount, disqualifiedCount, meetingsScheduled, salesCount, salesRevenue, meetingLeads, allLeads,] = await Promise.all([
            this.prisma.lead.count({
                where: { ...baseWhere, createdAt: { gte: todayStart, ...dateUpper } },
            }),
            this.prisma.lead.count({
                where: { ...baseWhere, createdAt: { gte: monthStart, ...dateUpper } },
            }),
            mqls.length > 0
                ? this.prisma.lead.count({
                    where: { ...baseWhere, statusId: { in: mqls }, ...dateFilter },
                })
                : 0,
            disqualifiedIds.length > 0
                ? this.prisma.lead.count({
                    where: {
                        ...baseWhere,
                        statusId: { in: disqualifiedIds },
                        ...dateFilter,
                    },
                })
                : 0,
            meetings.length > 0
                ? this.prisma.lead.count({
                    where: {
                        ...baseWhere,
                        statusId: { in: meetings },
                        ...dateFilter,
                    },
                })
                : 0,
            wons.length > 0
                ? this.prisma.lead.count({
                    where: { ...baseWhere, statusId: { in: wons }, ...dateFilter },
                })
                : 0,
            wons.length > 0
                ? this.prisma.lead.aggregate({
                    where: { ...baseWhere, statusId: { in: wons }, ...dateFilter },
                    _sum: { estimatedValue: true },
                })
                : { _sum: { estimatedValue: 0 } },
            meetings.length > 0
                ? this.prisma.lead.count({
                    where: {
                        ...baseWhere,
                        statusId: { in: [...meetings, ...finals] },
                        ...dateFilter,
                    },
                })
                : 0,
            this.prisma.lead.count({
                where: { ...baseWhere, ...dateFilter },
            }),
        ]);
        const revenueByStatus = await this.prisma.lead.groupBy({
            by: ['statusId'],
            where: { ...baseWhere, ...dateFilter },
            _sum: { estimatedValue: true },
            _count: true,
        });
        const statusMap = new Map(statuses.map((s) => [s.id, s.name]));
        const revenueByStatusMapped = revenueByStatus.map((r) => ({
            statusId: r.statusId,
            statusName: statusMap.get(r.statusId) || r.statusId,
            count: r._count,
            totalValue: r._sum.estimatedValue || 0,
        }));
        const conversionMeetingToClose = meetingLeads > 0 ? salesCount / meetingLeads : 0;
        const conversionFullFunnel = allLeads > 0 ? salesCount / allLeads : 0;
        return {
            leadsToday,
            leadsMonth,
            mqls: mqlCount,
            disqualified: disqualifiedCount,
            meetingsScheduled,
            sales: salesCount,
            salesRevenue: salesRevenue._sum.estimatedValue || 0,
            revenueByStatus: revenueByStatusMapped,
            conversionMeetingToClose: Math.round(conversionMeetingToClose * 10000) / 100,
            conversionFullFunnel: Math.round(conversionFullFunnel * 10000) / 100,
        };
    }
    async getCpl(orgId, month) {
        const targetMonth = month || new Date().toISOString().slice(0, 7);
        const monthStart = new Date(`${targetMonth}-01T00:00:00.000Z`);
        const nextMonth = new Date(monthStart);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const [investments, leadCount] = await Promise.all([
            this.prisma.monthlyInvestment.findMany({
                where: { organizationId: orgId, month: targetMonth },
            }),
            this.prisma.lead.count({
                where: {
                    organizationId: orgId,
                    deletedAt: null,
                    createdAt: { gte: monthStart, lt: nextMonth },
                },
            }),
        ]);
        const totalInvestment = investments.reduce((sum, i) => sum + i.amount, 0);
        const cpl = leadCount > 0 ? totalInvestment / leadCount : 0;
        return {
            month: targetMonth,
            totalInvestment,
            leadCount,
            cpl: Math.round(cpl),
            investments,
        };
    }
    async getFunnel(orgId, pipelineId) {
        const statuses = await this.prisma.pipelineStatus.findMany({
            where: { pipelineId },
            orderBy: { position: 'asc' },
        });
        const counts = await this.prisma.lead.groupBy({
            by: ['statusId'],
            where: {
                organizationId: orgId,
                pipelineId,
                deletedAt: null,
            },
            _count: true,
        });
        const countMap = new Map(counts.map((c) => [c.statusId, c._count]));
        const steps = statuses.map((s, i) => {
            const count = countMap.get(s.id) || 0;
            const prevCount = i === 0 ? count : countMap.get(statuses[i - 1].id) || 0;
            const conversionFromPrev = i === 0 || prevCount === 0
                ? 100
                : Math.round((count / prevCount) * 10000) / 100;
            return {
                statusId: s.id,
                statusName: s.name,
                color: s.color,
                position: s.position,
                count,
                conversionFromPrev,
                isMql: s.isMql,
                isMeeting: s.isMeeting,
                isFinal: s.isFinal,
                isWon: s.isWon,
            };
        });
        const totalLeads = steps.reduce((sum, s) => sum + s.count, 0);
        return { pipelineId, totalLeads, steps };
    }
    buildDateFilter(dateFrom, dateTo) {
        if (!dateFrom && !dateTo)
            return {};
        const filter = {};
        if (dateFrom)
            filter.createdAt = { gte: new Date(dateFrom) };
        if (dateTo) {
            const endOfDay = new Date(dateTo);
            endOfDay.setDate(endOfDay.getDate() + 1);
            filter.createdAt = {
                ...filter.createdAt,
                lt: endOfDay,
            };
        }
        return filter;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map