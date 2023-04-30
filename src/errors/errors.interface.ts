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
  SERVICE_UNAVAILABLE = '007',
  BAD_GATEWAY = '008',
  GATEWAY_TIMEOUT = '009',
  GENERAL_FORBIDEN = '014',
  ACCOUNT_NOT_FOUND = '015',
}

export enum MongoDbError {
  DUPLICATE_KEY_ERROR = 11000,
}
