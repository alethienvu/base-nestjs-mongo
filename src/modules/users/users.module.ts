import { Module } from '@nestjs/common';
import { UsersController } from '../../modules/users/users.controller';
import { UsersService } from '../../modules/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../modules/auth/auth.constants';
// import { MailModule } from '../../modules/mail/mail.module';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModel } from '../../shared/constants';
import { UsersSchema } from './users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DbModel.Users, schema: UsersSchema }]),
    JwtModule.register({
      secret: jwtConstants.accessTokenSecret,
      signOptions: { expiresIn: jwtConstants.accessTokenExpiry },
    }),
    // MailModule,
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
