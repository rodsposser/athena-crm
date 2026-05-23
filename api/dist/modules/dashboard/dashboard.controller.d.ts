import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly service;
    constructor(service: DashboardService);
    getKpis(orgId: string, pipelineId?: string, dateFrom?: string, dateTo?: string): Promise<{
        leadsToday: number;
        leadsMonth: number;
        mqls: number;
        disqualified: number;
        meetingsScheduled: number;
        sales: number;
        salesRevenue: number;
        revenueByStatus: {
            statusId: string;
            statusName: string;
            count: number;
            totalValue: number;
        }[];
        conversionMeetingToClose: number;
        conversionFullFunnel: number;
    }>;
    getCpl(orgId: string, month?: string): Promise<{
        month: string;
        totalInvestment: any;
        leadCount: number;
        cpl: number;
        investments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            description: string | null;
            sourceId: string | null;
            month: string;
            amount: number;
        }[];
    }>;
    getFunnel(orgId: string, pipelineId: string): Promise<{
        pipelineId: string;
        totalLeads: number;
        steps: {
            statusId: string;
            statusName: string;
            color: string;
            position: number;
            count: number;
            conversionFromPrev: number;
            isMql: boolean;
            isMeeting: boolean;
            isFinal: boolean;
            isWon: boolean;
        }[];
    }>;
}
