import { HttpStatus } from '@nestjs/common';

export interface IGeneralErrorShape {
  message: string;
  errorCode: string;
  description?: string;
  statusCode?: HttpStatus;
  stackTrace?: any;
  logData?: any;
  data?: any;
}

export enum ErrorCode {
  INTERNAL_SERVER_ERROR = '001',
  GENERAL_UNAUTHORIZED_EXCEPTION = '002',
  GENERAL_VALIDATION_EXCEPTION = '003',
  ACCESS_TOKEN_HEADER_NOT_PROVIDED = '004',
  JWT_EXPIRED = '005',
  NOT_VALID_JWT = '006',
  SERVICE_UNAVAILABLE = '007',
  BAD_GATEWAY = '008',
  GATEWAY_TIMEOUT = '009',
  EMAIL_FORMAT_IS_NOT_VALID = '010',
  EMAIL_IS_ALREADY_TAKEN = '011',
  PHONE_IS_ALREADY_TAKEN = '012',
  USER_IS_LOCKED = '013',
  GENERAL_FORBIDEN = '014',
  ACCOUNT_NOT_FOUND = '015',
}

export enum MongoDbError {
  DUPLICATE_KEY_ERROR = 11000,
}
