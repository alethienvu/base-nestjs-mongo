import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import jwtDecode from 'jwt-decode';
import { Errors } from 'src/errors/errors';
import { ErrorCode } from 'src/errors/errors.interface';
import { JwtPayload } from 'src/modules/auth/strategies/jwt.payload';
import { ACCESS_TOKEN_HEADER_NAME } from '../constants';
/**
 * This decorator get userId from headers
 */
export const UserID = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  try {
    const token = request.get(ACCESS_TOKEN_HEADER_NAME);
    const payload: JwtPayload = jwtDecode(token);
    return payload.userId;
  } catch (e) {
    throw new BadRequestException(Errors[ErrorCode.GENERAL_UNAUTHORIZED_EXCEPTION]);
  }
});
