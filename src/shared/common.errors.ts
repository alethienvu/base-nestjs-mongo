import { HttpStatus, PlainLiteralObject } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { BaseError } from '../errors/base.error';
import { flattenValidationErrors } from 'src/errors/errors';
import { ErrorCode } from 'src/errors/errors.interface';

export class BadRequestError extends BaseError<BadRequestError> {
  constructor(errorCode: ErrorCode, message?: string, cause?: Error, readonly response?: any) {
    super(BadRequestError, errorCode, message, cause);
    this.statusCode = HttpStatus.BAD_REQUEST;
  }
}

export class UnauthorizedError extends BaseError<UnauthorizedError> {
  constructor(message?: string, cause?: Error, readonly response?: any) {
    super(UnauthorizedError, ErrorCode.GENERAL_UNAUTHORIZED_EXCEPTION, message, cause);
  }
}

export class ForbiddenError extends BaseError<ForbiddenError> {
  constructor(message?: string, cause?: Error, readonly response?: any) {
    super(ForbiddenError, ErrorCode.GENERAL_FORBIDEN, message, cause);
  }
}

export class NotFoundError extends BaseError<NotFoundError> {
  constructor(message?: string, cause?: Error, readonly response?: any) {
    super(NotFoundError, ErrorCode.ACCOUNT_NOT_FOUND, message, cause);
  }
}

export class InternalServerError extends BaseError<InternalServerError> {
  constructor(errorCode: ErrorCode, message?: string, cause?: Error, readonly response?: any) {
    super(InternalServerError, errorCode, message, cause);
    this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

export class InputValidationError extends BaseError<InputValidationError> {
  constructor(
    errorCode: ErrorCode,
    message?: string,
    cause?: Error,
    readonly errors?: ValidationError[],
  ) {
    super(InputValidationError, errorCode, message, cause, {
      errors: errors ? flattenValidationErrors(errors) : undefined,
    });
  }
}

export class InvalidArgumentError extends BaseError<InvalidArgumentError> {
  constructor(errorCode: ErrorCode, message?: string, cause?: Error, data?: PlainLiteralObject) {
    super(InvalidArgumentError, errorCode, message, cause, data);
  }
}

export class DocumentNotFoundError extends BaseError<DocumentNotFoundError> {
  constructor(errorCode: ErrorCode, message?: string, cause?: Error, data?: PlainLiteralObject) {
    super(DocumentNotFoundError, errorCode, message, cause, data);
  }
}

export class ApiOperationError extends BaseError<ApiOperationError> {
  constructor(errorCode: ErrorCode, message?: string, cause?: any, data?: PlainLiteralObject) {
    super(ApiOperationError, errorCode, message, cause, data);
  }
}
