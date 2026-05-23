import { z } from 'zod';
export declare const envSchema: z.ZodObject<{
    DATABASE_URL: z.ZodString;
    REDIS_URL: z.ZodOptional<z.ZodString>;
    PORT: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    API_PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        test: "test";
        development: "development";
        production: "production";
    }>>;
    JWT_SECRET: z.ZodString;
    JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_SECRET: z.ZodString;
    JWT_REFRESH_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    CORS_ORIGINS: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type EnvConfig = z.infer<typeof envSchema>;
