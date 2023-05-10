import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponse } from 'src/errors/error-response.dto';

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
