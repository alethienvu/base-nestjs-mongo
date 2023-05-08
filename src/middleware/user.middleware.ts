/* istanbul ignore file */
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as httpContext from 'express-http-context';
import { decodeJWTToken } from '../shared/helpers';
import { ACCESS_TOKEN_HEADER_NAME } from 'src/shared/constants';
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
    const accessToken = req.get(ACCESS_TOKEN_HEADER_NAME);
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
    return httpContext.get('user');
  }
  return httpContext.get('user') ? (httpContext.get('user') as IJwtPayload)[key] : null;
}
