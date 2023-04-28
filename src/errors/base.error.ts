import { HttpStatus, PlainLiteralObject } from '@nestjs/common';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util';
import { WError } from 'verror';
import { ErrorCode } from './errors.interface';

export abstract class BaseError<T> extends WError {
  /**
   * Override HTTP status code
   */
  statusCode?: HttpStatus;
  /**
   * Override response
   */
  response?: any;

  data?: PlainLiteralObject;

  protected constructor(
    constructor: Constructor<T>,
    readonly errorCode: ErrorCode,
    readonly message?: string,
    cause?: Error,
    data?: PlainLiteralObject,
  ) {
    super(
      {
        name: constructor.name,
        cause,
        info: data,
        constructorOpt: constructor as any,
        strict: true,
      },
      message ? message : '',
    );
    this.data = data;
  }
}
