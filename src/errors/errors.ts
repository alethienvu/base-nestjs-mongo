// tslint:disable: max-line-length
import {
  HttpException,
  HttpStatus,
  BadRequestException,
  BadGatewayException,
  GatewayTimeoutException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { IGeneralErrorShape, ErrorCode } from './errors.interface';

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
  GENERAL_UNAUTHORIZED_EXCEPTION: {
    message: 'An exception occurred during the authorization process',
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: getErrorCode(ErrorCode.GENERAL_UNAUTHORIZED_EXCEPTION),
  },
  GENERAL_VALIDATION_EXCEPTION: {
    message: 'Validation error',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.GENERAL_VALIDATION_EXCEPTION),
  },
  ACCESS_TOKEN_HEADER_NOT_PROVIDED: {
    message: 'An access-token header is required',
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: getErrorCode(ErrorCode.ACCESS_TOKEN_HEADER_NOT_PROVIDED),
  },
  JWT_EXPIRED: {
    message: 'Jwt token expired',
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: getErrorCode(ErrorCode.JWT_EXPIRED),
  },
  NOT_VALID_JWT: {
    message: 'Not valid Jwt',
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: getErrorCode(ErrorCode.NOT_VALID_JWT),
  },
  BAD_GATEWAY: {
    message: 'Bad Gateway',
    statusCode: HttpStatus.BAD_GATEWAY,
    errorCode: getErrorCode(ErrorCode.BAD_GATEWAY),
  },
  GATEWAY_TIMEOUT: {
    message: 'Gateway TImeout',
    statusCode: HttpStatus.GATEWAY_TIMEOUT,
    errorCode: getErrorCode(ErrorCode.GATEWAY_TIMEOUT),
  },
  GET_ACCOUNTS_PROFILE_FAILED: {
    message: 'Failed to get user profile',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.GET_ACCOUNTS_PROFILE_FAILED),
  },
  EMAIL_FORMAT_IS_NOT_VALID: {
    message: 'Email format is not valid',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.EMAIL_FORMAT_IS_NOT_VALID),
  },
  EMAIL_IS_ALREADY_TAKEN: {
    message: 'Email is already taken',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.EMAIL_IS_ALREADY_TAKEN),
  },
  PHONE_IS_ALREADY_TAKEN: {
    message: 'Phone is already taken',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.PHONE_IS_ALREADY_TAKEN),
  },
  EMAIL_OR_PHONE_REQUIRED: {
    message: 'Email or phone must be provided',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.EMAIL_OR_PHONE_REQUIRED),
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
