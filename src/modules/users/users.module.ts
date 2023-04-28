import { Module } from '@nestjs/common';
import { UsersController } from 'src/modules/users/users.controller';
import { UsersService } from 'src/modules/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/modules/auth/auth.constants';
// import { MailModule } from 'src/modules/mail/mail.module';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModel } from 'src/shared/constants';
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
