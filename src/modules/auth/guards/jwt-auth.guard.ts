import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import jwtDecode from 'jwt-decode';
import { IJwtPayload } from '../../../modules/auth/strategies/jwt.payload';
import { AUTH_HEADERS } from '../../../shared/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.get(AUTH_HEADERS.ACCESS_TOKEN);
      const payload: IJwtPayload = jwtDecode(token);
      return !!payload;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
