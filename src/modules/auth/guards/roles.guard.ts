import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtPayload } from '../strategies/jwt.payload';
import jwtDecode from 'jwt-decode';
import { UserRole } from '../../../shared/enum/users.const';
import { ACCESS_TOKEN_HEADER_NAME } from 'src/shared/constants';

@Injectable()
export class OnlyAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.get(ACCESS_TOKEN_HEADER_NAME);
    const payload: JwtPayload = jwtDecode(token);
    const { role } = payload;
    if (role === UserRole.ADMIN) return true;
    else throw new ForbiddenException();
  }
}

@Injectable()
export class OnlySuperAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.get(ACCESS_TOKEN_HEADER_NAME);
    const payload: JwtPayload = jwtDecode(token);
    const { role } = payload;
    if (role === UserRole.SUPER_ADMIN) return true;
    else throw new ForbiddenException();
  }
}

@Injectable()
export class AdminAndSuperAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.get(ACCESS_TOKEN_HEADER_NAME);
    const payload: JwtPayload = jwtDecode(token);
    const { role } = payload;
    if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) return true;
    else throw new ForbiddenException();
  }
}
