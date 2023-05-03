import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from '../../../modules/auth/strategies/jwt.payload';
import { ACCESS_TOKEN_HEADER_NAME } from '../../../shared/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.get(ACCESS_TOKEN_HEADER_NAME);
      const payload: JwtPayload = jwtDecode(token);
      return !!payload;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
