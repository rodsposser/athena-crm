export declare class CreateWebhookDto {
    name: string;
    url: string;
    events: string[];
    headers?: Record<string, string>;
}
