import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { infoLog } from 'src/shared/logger';
import { reply } from 'src/shared/helpers';
import { determineErrorResponseAndStatus } from 'src/errors/errors';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const httpResponse = ctx.getResponse<Response>();
    infoLog(exception);
    const { response, statusCode } = determineErrorResponseAndStatus(exception);
    return reply(httpResponse, response, statusCode);
  }
}
