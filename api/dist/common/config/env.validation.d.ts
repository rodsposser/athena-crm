export declare function validateEnv(config: Record<string, unknown>): {
    DATABASE_URL: string;
    API_PORT: number;
    NODE_ENV: "test" | "development" | "production";
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
    REDIS_URL?: string | undefined;
    PORT?: number | undefined;
    CORS_ORIGINS?: string | undefined;
};
