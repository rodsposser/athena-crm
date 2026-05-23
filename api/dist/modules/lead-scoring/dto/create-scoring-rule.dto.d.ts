export declare enum ConditionOperator {
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    GREATER_THAN = "GREATER_THAN",
    LESS_THAN = "LESS_THAN",
    CONTAINS = "CONTAINS",
    IS_SET = "IS_SET",
    IS_NOT_SET = "IS_NOT_SET"
}
export declare class RuleConditionDto {
    field: string;
    operator: ConditionOperator;
    value?: any;
}
export declare class CreateScoringRuleDto {
    name: string;
    condition: RuleConditionDto;
    points: number;
    isActive?: boolean;
}
