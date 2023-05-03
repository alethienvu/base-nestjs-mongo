import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from '../../modules/auth/strategies/jwt.payload';
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
    throw new UnauthorizedException();
  }
});
