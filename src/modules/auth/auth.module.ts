import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';
import { jwtConstants } from 'src/modules/auth/auth.constants';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { AuthController } from 'src/modules/auth/auth.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { redisConfig } from 'src/configs/redis.config';
import { UsersService } from '../users/users.service';
// import { MailModule } from 'src/modules/mail/mail.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.accessTokenSecret,
      signOptions: { expiresIn: jwtConstants.accessTokenExpiry },
    }),
    CacheModule.register({
      ...redisConfig,
      isGlobal: true,
    }),
    // MailModule,
  ],
  providers: [AuthService, JwtStrategy, UsersService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
