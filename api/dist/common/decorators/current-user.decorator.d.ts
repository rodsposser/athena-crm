export interface JwtUser {
    sub: string;
    email: string;
    orgId: string;
    role: string;
}
export declare const CurrentUser: (...dataOrPipes: (keyof JwtUser | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
export declare const CurrentOrg: (...dataOrPipes: unknown[]) => ParameterDecorator;
