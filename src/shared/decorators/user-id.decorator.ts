import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { getUserId } from 'src/middleware/user.middleware';

export const UserID = createParamDecorator((_data: string, _ctx: ExecutionContext) => {
  try {
    const userId = getUserId();
    return userId;
  } catch (e) {
    throw new UnauthorizedException();
  }
});
