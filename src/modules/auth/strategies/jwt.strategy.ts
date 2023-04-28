import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from 'src/modules/auth/auth.constants';
import { JwtPayload } from 'src/modules/auth/strategies/jwt.payload';
import { UsersService } from 'src/modules/users/users.service';
import { Errors } from 'src/errors/errors';
import { ErrorCode } from 'src/errors/errors.interface';
import { UserStatus } from 'src/shared/enum/users.const';
import { IUser } from 'src/modules/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessTokenSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<IUser> {
    console.log("🚀🚀🚀 ~ file: jwt.strategy.ts:23 ~ JwtStrategy ~ validate ~ payload:", payload);
    const user = await this.userService.findUserById(payload.userId);
    console.log("🚀🚀🚀 ~ file: jwt.strategy.ts:24 ~ JwtStrategy ~ validate ~ user:", user);
    if (!user) {
      throw new BadRequestException(Errors[ErrorCode.GENERAL_UNAUTHORIZED_EXCEPTION]);
    }

    if (user.status == UserStatus.LOCKED) {
      throw new BadRequestException(Errors[ErrorCode.USER_IS_LOCKED]);
    }

    return user;
  }
}
