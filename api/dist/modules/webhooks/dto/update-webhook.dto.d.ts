export declare class UpdateWebhookDto {
    name?: string;
    url?: string;
    events?: string[];
    headers?: Record<string, string>;
    isActive?: boolean;
}
