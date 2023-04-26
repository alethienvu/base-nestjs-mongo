import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DetailInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: CallHandler<any>): Observable<any> {
    return call$.handle().pipe(
      map((data) => {
        const headers = Object.assign({}, data.headers);
        for (const key in headers) {
          if (headers.hasOwnProperty(key)) {
            const req = context.switchToHttp().getRequest();
            req.res.header(key, headers[key]);
          }
        }

        return data.item;
      }),
    );
  }
}
