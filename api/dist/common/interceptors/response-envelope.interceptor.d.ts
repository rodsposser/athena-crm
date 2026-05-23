import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface EnvelopedResponse<T> {
    data: T;
    meta?: Record<string, unknown>;
}
export declare class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, EnvelopedResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<EnvelopedResponse<T>>;
}
