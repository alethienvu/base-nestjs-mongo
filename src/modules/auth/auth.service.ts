import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { AUTH_CACHE_PREFIX, jwtConstants } from '../../modules/auth/auth.constants';
import { LoginDto } from '../../modules/auth/dto/login.dto';
import { RefreshAccessTokenDto } from '../../modules/auth/dto/refresh-access-token.dto';
import { ResponseLogin } from '../../modules/auth/dto/response-login.dto';
import { IJwtPayload } from '../../modules/auth/strategies/jwt.payload';
import { UsersService } from '../../modules/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { IUser } from '../users/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ResponseLogin> {
    let user: IUser;

    if (!(await this.userService.checkUserEmailAddressExisted(loginDto.email))) {
      throw new BadRequestException(`Not found any user with email is: ${loginDto.email}`);
    } else {
      user = await this.userService.findUserByEmailAddress(loginDto.email);
    }

    const compare_pass = crypto.createHmac('sha256', loginDto.password).digest('hex');
    const { password: savedPass } = await this.userService.findUserWithPasswordById(user?.id);
    if (compare_pass !== savedPass) {
      throw new BadRequestException(`Wrong password`);
    }

    const accessToken = this.generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = await this.generateRefreshToken(accessToken.accessToken);
    const { email, role, id } = user;
    const res: ResponseLogin = {
      ...accessToken,
      ...refreshToken,
      id,
      email,
      role,
    };
    return res;
  }

  async refreshAccessToken(
    accessToken: string,
    refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<ResponseLogin> {
    const { refreshToken } = refreshAccessTokenDto;
    const oldHashAccessToken = await this.cacheManager.get<string>(
      `${AUTH_CACHE_PREFIX}${refreshToken}`,
    );
    if (!oldHashAccessToken) throw new UnauthorizedException('JWT token is expired!');

    const hashAccessToken = createHash('sha256').update(accessToken).digest('hex');
    if (hashAccessToken === oldHashAccessToken) {
      const oldPayload = await this.decodeAccessToken(accessToken);
      delete oldPayload.iat;
      delete oldPayload.exp;
      const newAccessToken = this.generateAccessToken(oldPayload);
      const newRefreshToken = await this.generateRefreshToken(newAccessToken.accessToken);
      await this.cacheManager.del(`${AUTH_CACHE_PREFIX}${refreshToken}`);
      return {
        ...newAccessToken,
        ...newRefreshToken,
      };
    } else throw new UnauthorizedException();
  }

  generateAccessToken(payload: IJwtPayload): { accessToken: string } {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async generateRefreshToken(accessToken: string): Promise<{ refreshToken: string }> {
    const refreshToken = uuidv4();
    const hashedAccessToken = createHash('sha256').update(accessToken).digest('hex');
    await this.cacheManager.set(
      `${AUTH_CACHE_PREFIX}${refreshToken}`,
      hashedAccessToken,
      jwtConstants.refreshTokenExpiry,
    );
    return {
      refreshToken: refreshToken,
    };
  }

  async verifyAccessToken(accessToken: string): Promise<Record<string, unknown>> {
    return this.jwtService.verifyAsync(accessToken);
  }

  async decodeAccessToken(accessToken: string): Promise<IJwtPayload | any> {
    return this.jwtService.decode(accessToken);
  }
}
