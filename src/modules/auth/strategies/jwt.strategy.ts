import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from 'src/modules/auth/auth.constants';
import { JwtPayload } from 'src/modules/auth/strategies/jwt.payload';
import { UsersService } from 'src/modules/users/users.service';
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
    const user = await this.userService.findUserById(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.status == UserStatus.LOCKED) {
      throw new ForbiddenException(`User account is locked!`);
    }

    return user;
  }
}
