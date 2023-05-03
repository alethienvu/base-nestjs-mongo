// tslint:disable: max-line-length
import {
  HttpException,
  HttpStatus,
  BadRequestException,
  BadGatewayException,
  GatewayTimeoutException,
  InternalServerErrorException,
  NotFoundException,
  ValidationError,
} from '@nestjs/common';
import iterate from 'iterare';
import * as _ from 'lodash';
import { IGeneralErrorShape, ErrorCode } from './errors.interface';
import { ErrorResponse } from './error-response.dto';
import { BaseError } from './base.error';
import { InputValidationError } from '../shared/common.errors';
import { isObject } from 'class-validator';

export const BASE_ERROR_CODE = '03';
const GROUP_ERROR_CODE = '03';

const getErrorCode = (code) => `${BASE_ERROR_CODE}${GROUP_ERROR_CODE}${code}`;

export const Errors = {
  INTERNAL_SERVER_ERROR: {
    message: 'Internal server error occurred',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.INTERNAL_SERVER_ERROR),
  },
  SERVICE_UNAVAILABLE: {
    message: 'Service Temporarily Unavailable',
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    errorCode: getErrorCode(ErrorCode.SERVICE_UNAVAILABLE),
  },
  BAD_GATEWAY: {
    message: 'Bad Gateway',
    statusCode: HttpStatus.BAD_GATEWAY,
    errorCode: getErrorCode(ErrorCode.BAD_GATEWAY),
  },
  GATEWAY_TIMEOUT: {
    message: 'Gateway Timeout',
    statusCode: HttpStatus.GATEWAY_TIMEOUT,
    errorCode: getErrorCode(ErrorCode.GATEWAY_TIMEOUT),
  },
};

export function createGeneralExceptionError(error: any): IGeneralErrorShape {
  if (error.statusCode) {
    return error;
  }
  return {
    ...Errors.INTERNAL_SERVER_ERROR,
    message: error.message,
  };
}

export function handleApiClientError(err: any, defaultError?: IGeneralErrorShape): never {
  if (err.response?.body) {
    throw getHttpException({
      ...(defaultError || Errors.INTERNAL_SERVER_ERROR),
      ...err.response.body,
    });
  }
  throw err;
}

export function getHttpException(err: IGeneralErrorShape): HttpException {
  switch (err.statusCode) {
    case HttpStatus.BAD_REQUEST:
      return new BadRequestException(err);
    case HttpStatus.NOT_FOUND:
      return new NotFoundException(err);
    case HttpStatus.BAD_GATEWAY:
      return new BadGatewayException(err);
    case HttpStatus.GATEWAY_TIMEOUT:
      return new GatewayTimeoutException(err);
    default:
      return new InternalServerErrorException(err);
  }
}
export function determineErrorResponseAndStatus(exception: any): {
  response: any;
  statusCode: HttpStatus;
} {
  let errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
  let { statusCode, message } = {
    message: 'Internal server error',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  };
  let meta = {};
  let response: any = new ErrorResponse({
    errorCode,
    statusCode,
    message,
    meta,
  });

  if (exception instanceof BaseError) {
    errorCode = exception.errorCode;
    statusCode = exception.statusCode;
    message = exception.message;
    meta = exception.data ? exception.data.meta : undefined;
    const errors =
      exception instanceof InputValidationError && exception.errors
        ? flattenValidationErrors(exception.errors)
        : undefined;
    response =
      exception.response ||
      new ErrorResponse({
        errorCode,
        statusCode,
        message,
        errors,
        meta,
      });
  } else if (exception instanceof HttpException) {
    statusCode = exception.getStatus();
    if (isObject(exception.getResponse())) {
      response = exception.getResponse() as any;
    } else {
      message = exception.getResponse() as string;
      response = new ErrorResponse({
        errorCode,
        statusCode,
        message,
      });
    }
  }

  return { response, statusCode };
}
export function flattenValidationErrors(validationErrors: ValidationError[]): string[] {
  return iterate(validationErrors)
    .map(mapChildrenToValidationErrors)
    .flatten()
    .filter((item: any) => _.isObject(item.constraints))
    .map((item: any) => _.values(item.constraints))
    .flatten()
    .toArray();
}
function mapChildrenToValidationErrors(error: ValidationError): ValidationError[] {
  if (!(error.children && error.children.length)) {
    return [error];
  }
  const validationErrors = [];
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenToValidationErrors(item));
    }
    validationErrors.push(prependConstraintsWithParentProp(error, item));
  }
  return validationErrors;
}
function prependConstraintsWithParentProp(
  parentError: ValidationError,
  error: ValidationError,
): ValidationError {
  const constraints = {};
  for (const key in error.constraints) {
    if (error.constraints.hasOwnProperty(key)) {
      constraints[key] = `${parentError.property}.${error.constraints[key]}`;
    }
  }
  return {
    ...error,
    constraints,
  };
}
