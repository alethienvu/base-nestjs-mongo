/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole } from '../../../shared/enum/users.const';
import { getUserData } from 'src/middleware/user.middleware';

@Injectable()
export class OnlyAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = getUserData();
    const { role } = user;
    if (role === UserRole.ADMIN) return true;
    else throw new ForbiddenException();
  }
}

@Injectable()
export class OnlySuperAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = getUserData();
    const { role } = user;
    if (role === UserRole.SUPER_ADMIN) return true;
    else throw new ForbiddenException();
  }
}

@Injectable()
export class AdminAndSuperAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = getUserData();
    const { role } = user;
    if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) return true;
    else throw new ForbiddenException();
  }
}
