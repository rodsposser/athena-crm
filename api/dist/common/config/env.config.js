"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().min(1),
    REDIS_URL: zod_1.z.string().url().optional(),
    PORT: zod_1.z.coerce.number().optional(),
    API_PORT: zod_1.z.coerce.number().default(3333),
    NODE_ENV: zod_1.z
        .enum(['development', 'production', 'test'])
        .default('development'),
    JWT_SECRET: zod_1.z.string().min(10),
    JWT_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(10),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    CORS_ORIGINS: zod_1.z.string().optional(),
});
//# sourceMappingURL=env.config.js.map