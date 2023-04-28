import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import jwtDecode from 'jwt-decode';
import { Errors } from 'src/errors/errors';
import { ErrorCode } from 'src/errors/errors.interface';
import { JwtPayload } from 'src/modules/auth/strategies/jwt.payload';
import { ACCESS_TOKEN_HEADER_NAME } from 'src/shared/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.get(ACCESS_TOKEN_HEADER_NAME);
      const payload: JwtPayload = jwtDecode(token);
      console.log('🚀🚀🚀 ~ JwtAuthGuard ~ payload:', payload);
      return true;
    } catch (e) {
      throw new BadRequestException(Errors[ErrorCode.GENERAL_UNAUTHORIZED_EXCEPTION]);
    }
  }
}
