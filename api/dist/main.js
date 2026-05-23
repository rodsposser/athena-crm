"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const response_envelope_interceptor_1 = require("./common/interceptors/response-envelope.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = Number(process.env.PORT) || configService.get('API_PORT', 3333);
    app.use((0, helmet_1.default)());
    const corsOrigins = configService.get('CORS_ORIGINS', 'http://localhost:3001');
    app.enableCors({
        origin: corsOrigins.split(',').map((o) => o.trim()),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new response_envelope_interceptor_1.ResponseEnvelopeInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    await app.listen(port);
    console.log(`CRM API running on http://localhost:${port}`);
}
bootstrap().catch((err) => {
    console.error('Fatal startup error:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map