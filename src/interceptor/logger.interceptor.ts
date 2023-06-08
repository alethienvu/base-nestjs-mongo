import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getHttpRequestLog, infoLog } from '../shared/logger';
import * as config from 'config';
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const requestLog = getHttpRequestLog(request);
    if (config.get('service.node_env') === 'production') {
      infoLog(requestLog, 'LOG_REQUEST');
    }
    return next.handle().pipe(
      map((res) => {
        return res;
      }),
    );
  }
}
