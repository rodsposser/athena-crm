"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
const env_config_1 = require("./env.config");
function validateEnv(config) {
    const result = env_config_1.envSchema.safeParse(config);
    if (!result.success) {
        const formatted = result.error.issues
            .map((i) => `  ${i.path.join('.')}: ${i.message}`)
            .join('\n');
        throw new Error(`Environment validation failed:\n${formatted}`);
    }
    return result.data;
}
//# sourceMappingURL=env.validation.js.map