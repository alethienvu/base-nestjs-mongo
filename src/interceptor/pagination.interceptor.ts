import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: CallHandler<any>): Observable<any> {
    return call$.handle().pipe(
      map((data) => {
        const headers = Object.assign({}, data.headers);
        const items = Object.assign({}, data.items);
        for (const key in headers) {
          if (Object.prototype.hasOwnProperty.call(headers, key)) {
            const req = context.switchToHttp().getRequest();
            req.res.header(key, headers[key]);
          }
        }
        data = Object.values(items);
        return data;
      }),
    );
  }
}
