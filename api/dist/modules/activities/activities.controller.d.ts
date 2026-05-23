import { ActivitiesService } from './activities.service';
export declare class ActivitiesController {
    private readonly service;
    constructor(service: ActivitiesService);
    getByLead(orgId: string, leadId: string, cursor?: string, limit?: string): Promise<({
        user: {
            name: string;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        leadId: string;
        type: import("@prisma/client").$Enums.ActivityType;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    })[]>;
}
