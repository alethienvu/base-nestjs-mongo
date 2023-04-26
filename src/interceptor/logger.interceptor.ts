import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getHttpRequestLog, infoLog } from '../shared/Logger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const requestLog = getHttpRequestLog(request);
    infoLog(requestLog, 'LOG_REQUEST');
    return next.handle().pipe(
      map((res) => {
        return res;
      }),
    );
  }
}
