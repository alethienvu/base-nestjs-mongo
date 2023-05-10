import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../modules/users/users.module';
import { jwtConstants } from '../../modules/auth/auth.constants';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtStrategy } from '../../modules/auth/strategies/jwt.strategy';
import { AuthController } from '../../modules/auth/auth.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersService } from '../users/users.service';
import { EmailModule } from '../email/emails.module';
import { redisStore } from 'cache-manager-redis-yet';
import { redisConfig } from 'src/configs/redis.config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.accessTokenSecret,
      signOptions: { expiresIn: jwtConstants.accessTokenExpiry },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: redisConfig.url,
          password: redisConfig.pass,
        }),
      }),
    }),
    EmailModule,
  ],
  providers: [AuthService, JwtStrategy, UsersService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
