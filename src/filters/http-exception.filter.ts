import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { infoLog } from 'src/shared/Logger';
import { determineErrorResponseAndStatus } from 'src/shared/errors';
import { reply } from 'src/shared/helpers';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const httpResponse = ctx.getResponse<Response>();
    infoLog(exception);
    const { response, statusCode } = determineErrorResponseAndStatus(exception);
    return reply(httpResponse, response, statusCode);
  }
}
