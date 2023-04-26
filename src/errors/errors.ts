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
  CANNOT_CREATE_WALLET: {
    message: 'Cannot create Wallet',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.CANNOT_CREATE_WALLET),
  },
  WALLET_ALREADY_EXISTS: {
    message: 'Wallet already exists',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.WALLET_ALREADY_EXISTS),
  },
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
  KIPLE_SIGNATURE_REQUIRED: {
    message: 'kiple-signature is required header',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.KIPLE_SIGNATURE_REQUIRED),
  },
  INVALID_KIPLE_SIGNATURE: {
    message: 'Invalid kiple-signature',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.INVALID_KIPLE_SIGNATURE),
  },
  WALLET_NOT_FOUND: {
    message: 'Wallet not found',
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getErrorCode(ErrorCode.WALLET_NOT_FOUND),
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
  CREDIT_CARD_NOT_FOUND: {
    message: 'No card is found with this id',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.CREDIT_CARD_NOT_FOUND),
  },
  KIPLE_TRANSACTION_FAILED: {
    message: 'Kiple transaction failed',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.KIPLE_TRANSACTION_FAILED),
  },
  TRANSACTION_NOT_FOUND: {
    message: 'Transaction not found',
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getErrorCode(ErrorCode.TRANSACTION_NOT_FOUND),
  },
  TRANSACTION_ALREADY_SAVED: {
    message: 'Transaction already saved',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.TRANSACTION_ALREADY_SAVED),
  },
  WALLET_AUTO_TOPUP_SETTINGS_NOT_FOUND: {
    message: 'Wallet auto topup settings do not exist',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.WALLET_AUTO_TOPUP_SETTINGS_NOT_FOUND),
  },
  WALLET_AUTO_TOPUP_INACTIVE: {
    message: 'Wallet auto topup inactive',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.WALLET_AUTO_TOPUP_INACTIVE),
  },
  INVALID_KIPLE_PIN_TOKEN: {
    message: 'Invalid PIN token',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.INVALID_KIPLE_PIN_TOKEN),
  },
  GENERAL_KIPLE_ERROR: {
    message: 'Something wrong has happened on Kiple side',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.GENERAL_KIPLE_ERROR),
  },
  KIPLE_RESPONSE_TIMEOUT: {
    message: 'Kiple response timeout',
    statusCode: HttpStatus.GATEWAY_TIMEOUT,
    errorCode: getErrorCode(ErrorCode.KIPLE_RESPONSE_TIMEOUT),
  },
  KIPLE_RESPONSE_BAD_GATEWAY: {
    message: 'Bad Gateway',
    statusCode: HttpStatus.BAD_GATEWAY,
    errorCode: getErrorCode(ErrorCode.KIPLE_RESPONSE_BAD_GATEWAY),
  },
  INVALID_KIPLE_PIN: {
    message: 'Invalid PIN',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.INVALID_KIPLE_PIN),
  },
  RESET_PIN_CODE_EXPIRED: {
    message:
      'The Verification Code expired. Kindly tap on RESEND CODE to request for a new Verification Code',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.RESET_PIN_CODE_EXPIRED),
  },
  RESET_PIN_WRONG_CODE: {
    message: 'A wrong verification code entered.',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.RESET_PIN_WRONG_CODE),
  },
  NOT_VALID_OTP: {
    message: 'Not valid OTP',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.NOT_VALID_OTP),
  },
  MAXIMUM_BALANCE_EXCEEDED: {
    message: 'Maximum balance exceeded',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.MAXIMUM_BALANCE_EXCEEDED),
  },
  LESS_THAN_MIMIMUM_BALANCE: {
    message: 'Less than the minimum balance',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.LESS_THAN_MIMIMUM_BALANCE),
  },
  NOT_VALID_PAYMENT_METHOD: {
    message: 'Not valid payment method or payment submethod',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.LESS_THAN_MIMIMUM_BALANCE),
  },
  TRANSACTION_SHOULD_HAVE_EXPIRY_DATE: {
    message: 'Transaction should have expiry date',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.TRANSACTION_NOT_FOUND),
  },
  SMARTPAY_ERROR: {
    message: 'Smartpay error',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.TRANSACTION_NOT_FOUND),
  },
  INSUFFICIENT_BALANCE: {
    message: 'Insufficient balance',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.TRANSACTION_NOT_FOUND),
  },
  FUEL_VOUCHER_REQUIRED: {
    message: 'Only voucher with fuel type could be used as payment method',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.FUEL_VOUCHER_REQUIRED),
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
  CUSTOMER_CHARGE_LIMIT: {
    message: 'Customer reaches charge limit per day ',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.CUSTOMER_CHARGE_LIMIT),
  },
  CUSTOMER_MAX_TRANSACTION_LIMIT: {
    message: 'Customer reaches maximum of number transaction per day ',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.CUSTOMER_MAX_TRANSACTION_LIMIT),
  },
  CUSTOMER_TRANSACTION_AMOUNT_LIMIT: {
    message: 'Payment transaction amount is over limit',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.CUSTOMER_TRANSACTION_AMOUNT_LIMIT),
  },
  BALANCE_LIMIT_EXCEEDED: {
    message: 'Balance limit exceeded',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.BALANCE_LIMIT_EXCEEDED),
  },
  SWITCH_ERROR: {
    message: 'Switch error',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.SWITCH_ERROR),
  },
  ORDERS_ERROR: {
    message: 'Order service error',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.ORDERS_ERROR),
  },
  BLACKLIST_ERROR: {
    message: 'Blacklist service error',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.BLACKLIST_ERROR),
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

export const FraudErrorMessage = {
  BLOCK_TOPUP: '[WAL:091] Something went wrong on top-up. Please chat with us.',
  BLOCK_CHARGE: '[WAL:092] Something went wrong on charge. Please chat with us.',
};
