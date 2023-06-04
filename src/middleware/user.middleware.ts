/* istanbul ignore file */
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as httpContext from 'express-http-context';
import { decodeJWTToken } from '../shared/helpers';
import { AUTH_HEADERS } from 'src/shared/constants';
import { IJwtPayload } from 'src/modules/auth/strategies/jwt.payload';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  async use(req, res, next) {
    const user = await this.getUserSession(req);
    if (user) {
      req.user = user;
      httpContext.set('user', user);
      httpContext.set('userId', user.userId);
    }
    next();
  }

  async getUserSession(req): Promise<IJwtPayload | null> {
    const accessToken = req.get(AUTH_HEADERS.ACCESS_TOKEN);
    if (!accessToken) {
      return null;
    }
    const user: IJwtPayload = decodeJWTToken(accessToken);
    return user;
  }
}

/**
 * set userId from middleware
 * @returns userId
 */
export function getUserId() {
  return httpContext.get('userId');
}

/**
 *
 * @param key
 * @returns user from httpContext (set from middleware)
 */
export function getUserData(key?: keyof IJwtPayload) {
  if (!key) {
    const userData = httpContext.get('user');
    if (!userData) {
      throw new UnauthorizedException();
    }
    return httpContext.get('user');
  }
  return httpContext.get('user') ? (httpContext.get('user') as IJwtPayload)[key] : null;
}
