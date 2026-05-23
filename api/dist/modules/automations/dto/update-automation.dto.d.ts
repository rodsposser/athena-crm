import { TriggerDto, ConditionDto, ActionDto } from './create-automation.dto';
export declare class UpdateAutomationDto {
    name?: string;
    pipelineId?: string;
    description?: string;
    trigger?: TriggerDto;
    conditions?: ConditionDto[];
    actions?: ActionDto[];
    isActive?: boolean;
}
