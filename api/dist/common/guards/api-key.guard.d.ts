import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeysService } from '../../modules/api-keys/api-keys.service';
export declare const USE_API_KEY = "useApiKey";
export declare class ApiKeyGuard implements CanActivate {
    private readonly reflector;
    private readonly apiKeysService;
    constructor(reflector: Reflector, apiKeysService: ApiKeysService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
