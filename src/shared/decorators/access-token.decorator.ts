import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AUTH_HEADERS } from '../constants';

export const AccessToken = createParamDecorator((_data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  try {
    const token = request.get(AUTH_HEADERS.ACCESS_TOKEN);
    return token;
  } catch (e) {
    throw new UnauthorizedException();
  }
});
