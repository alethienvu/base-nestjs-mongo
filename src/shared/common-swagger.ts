import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../errors/error-response.dto';

export const CommonErrorResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
      type: ErrorResponse,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
      type: ErrorResponse,
    }),
    ApiResponse({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      description: 'Service unavailable',
      type: ErrorResponse,
    }),
  );
};

export const CommonQueryRequest = () => {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      schema: {
        type: 'integer',
        minimum: 0,
      },
      example: 1,
      description: 'Page number',
      required: false,
    }),
    ApiQuery({
      name: 'perPage',
      schema: {
        type: 'integer',
        minimum: 0,
      },
      example: 20,
      description: 'Limit per page',
      required: false,
    }),
  );
};
