export declare class TriggerDto {
    type: string;
    params?: Record<string, any>;
}
export declare class ConditionDto {
    field: string;
    operator: string;
    value: any;
}
export declare class ActionDto {
    type: string;
    params: Record<string, any>;
}
export declare class CreateAutomationDto {
    name: string;
    pipelineId?: string;
    trigger: TriggerDto;
    conditions?: ConditionDto[];
    actions: ActionDto[];
    isActive?: boolean;
}
