import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwt;
    private readonly config;
    private readonly reflector;
    constructor(jwt: JwtService, config: ConfigService, reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
