import { HttpException, HttpStatus } from '@nestjs/common';
import { isObject, ValidationError } from 'class-validator';
import { BaseError } from '../errors/base.error';
import { ErrorResponse } from '../errors/error-response.dto';
import iterate from 'iterare';
import * as _ from 'lodash';
import { InputValidationError } from './common.errors';

export const BASE_ERROR_CODE = '001';
const GROUP_ERROR_CODE = '001';

const getErrorCode = (code) => `${BASE_ERROR_CODE}${GROUP_ERROR_CODE}${code}`;

export enum ErrorCode {
  GET_CURRENT_PRICE_FAIL = '001',
  GET_SUBSIDY_MEMBER_FAIL = '002',
  USER_ACTIVE_SUBSIDY_NOT_FOUND = '003',
  PRICE_FOR_USER_FUEL_TYPE_NOT_FOUND = '004',
  USER_NOT_ELIGIBLE_FOR_SUBSIDY = '005',
  TRANSACTION_NOT_FOUND = '006',
  INSUFFICIENT_QUOTA_BALANCE = '007',
  USER_NOT_FOUND = '008',
  FAILED_TO_UPDATE_USER_BALANCE = '009',
  MERCHANT_NOT_ELIGIBLE_FOR_SUBSIDY = '010',
  MERCHANT_NOT_FOUND = '011',
  MERCHANT_LINK_NOT_FOUND = '012',
  FAIL_TO_CREATE_PURCHASE = '013',
  FAIL_TO_CREATE_SUBSIDY_TRANSACTION = '014',
  ORDER_DUPLICATE = '015',
  BREAK_DOWN_DATA_NOT_FOUND = '016',
  REFUND_EXCEED_HOLD_AMOUNT = '017',
  FAIL_TO_REFUND = '018',
  INTERNAL_SERVER_ERROR = '019',
  TRANSACTION_EXCEED_30_DAYS = '020',
  TRANSACTION_NOT_IN_RIGHT_STATUS = '022',
  MEMBER_NOT_FOUND = '023',
  EXTERNAL_SERVICE_ERROR = '024',
  TRANSACTION_EXISTED = '025',
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
}

export const ERRORS = {
  GET_CURRENT_PRICE_FAIL: {
    message: 'Fail to get current price',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.GET_CURRENT_PRICE_FAIL),
  },
  GET_SUBSIDY_MEMBER_FAIL: {
    message: 'Fail to get subsidy member',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.GET_SUBSIDY_MEMBER_FAIL),
  },
  USER_ACTIVE_SUBSIDY_NOT_FOUND: {
    message: 'User active subsidy not found',
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getErrorCode(ErrorCode.USER_ACTIVE_SUBSIDY_NOT_FOUND),
  },
  PRICE_FOR_USER_FUEL_TYPE_NOT_FOUND: {
    message: 'Fuel price for user fuel type not found',
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getErrorCode(ErrorCode.USER_ACTIVE_SUBSIDY_NOT_FOUND),
  },
  USER_NOT_ELIGIBLE_FOR_SUBSIDY: {
    message: 'User is not eligible for subsidy',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.USER_NOT_ELIGIBLE_FOR_SUBSIDY),
  },
  TRANSACTION_NOT_FOUND: {
    message: 'Transaction not found',
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getErrorCode(ErrorCode.TRANSACTION_NOT_FOUND),
  },
  INSUFFICIENT_QUOTA_BALANCE: {
    message: 'Insufficient quota balance',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.INSUFFICIENT_QUOTA_BALANCE),
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getErrorCode(ErrorCode.USER_NOT_FOUND),
  },
  BREAK_DOWN_DATA_NOT_FOUND: {
    message: 'Break down data not found',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.BREAK_DOWN_DATA_NOT_FOUND),
  },
  MERCHANT_NOT_FOUND: {
    message: 'Merchant not found',
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getErrorCode(ErrorCode.MERCHANT_NOT_FOUND),
  },
  FAILED_TO_UPDATE_USER_BALANCE: {
    message: 'Failed to update user balance',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.FAILED_TO_UPDATE_USER_BALANCE),
  },
  MERCHANT_NOT_ELIGIBLE_FOR_SUBSIDY: {
    message: 'Merchant is not eligible for subsidy',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.MERCHANT_NOT_ELIGIBLE_FOR_SUBSIDY),
  },
  MERCHANT_LINK_NOT_FOUND: {
    message: 'Merchant link not found',
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getErrorCode(ErrorCode.MERCHANT_LINK_NOT_FOUND),
  },
  FAIL_TO_CREATE_PURCHASE: {
    message: 'Fail to make purchase',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.FAIL_TO_CREATE_PURCHASE),
  },
  FAIL_TO_CREATE_SUBSIDY_TRANSACTION: {
    message: 'Fail to create subsidy transaction',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.FAIL_TO_CREATE_SUBSIDY_TRANSACTION),
  },
  ORDER_DUPLICATE: {
    message: 'Order duplicate',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.ORDER_DUPLICATE),
  },
  REFUND_EXCEED_HOLD_AMOUNT: {
    message: 'Refund exceed hold amount',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.REFUND_EXCEED_HOLD_AMOUNT),
  },
  FAIL_TO_REFUND: {
    message: 'Failed to refund',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.FAIL_TO_REFUND),
  },
  TRANSACTION_EXCEED_30_DAYS: {
    message: 'Transaction exceed 30 days for balance issuance',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.TRANSACTION_EXCEED_30_DAYS),
  },
  TRANSACTION_NOT_IN_RIGHT_STATUS: {
    message: 'Transaction is not in the correct status for issuing refund',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.TRANSACTION_NOT_IN_RIGHT_STATUS),
  },
  MEMBER_NOT_FOUND: {
    message: 'Not found member with given id',
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getErrorCode(ErrorCode.MEMBER_NOT_FOUND),
  },
  TRANSACTION_EXISTED: {
    message: 'The given transaction is existed',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.TRANSACTION_EXISTED),
  },
};

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

export function flattenValidationErrors(validationErrors: ValidationError[]): string[] {
  return iterate(validationErrors)
    .map(mapChildrenToValidationErrors)
    .flatten()
    .filter((item) => _.isObject(item.constraints))
    .map((item) => _.values(item.constraints))
    .flatten()
    .toArray();
}
