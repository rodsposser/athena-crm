export declare enum ScheduledTaskType {
    CALL = "CALL",
    MEETING = "MEETING",
    CALLBACK = "CALLBACK",
    EMAIL = "EMAIL"
}
export declare class CreateScheduledTaskDto {
    leadId: string;
    type: ScheduledTaskType;
    scheduledAt: string;
    notes?: string;
}
