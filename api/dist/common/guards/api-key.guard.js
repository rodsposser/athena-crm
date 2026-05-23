"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyGuard = exports.USE_API_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const api_keys_service_1 = require("../../modules/api-keys/api-keys.service");
exports.USE_API_KEY = 'useApiKey';
let ApiKeyGuard = class ApiKeyGuard {
    reflector;
    apiKeysService;
    constructor(reflector, apiKeysService) {
        this.reflector = reflector;
        this.apiKeysService = apiKeysService;
    }
    async canActivate(context) {
        const useApiKey = this.reflector.getAllAndOverride(exports.USE_API_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!useApiKey)
            return true;
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        if (!apiKey) {
            throw new common_1.UnauthorizedException('Missing X-API-Key header');
        }
        const validKey = await this.apiKeysService.validateKey(apiKey);
        if (!validKey) {
            throw new common_1.UnauthorizedException('Invalid or expired API key');
        }
        request.apiKey = validKey;
        request.user = {
            sub: validKey.createdBy,
            orgId: validKey.organizationId,
            role: 'API',
        };
        return true;
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        api_keys_service_1.ApiKeysService])
], ApiKeyGuard);
//# sourceMappingURL=api-key.guard.js.map