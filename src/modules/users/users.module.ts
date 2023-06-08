import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from '../../modules/users/users.controller';
import { UsersService } from '../../modules/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../modules/auth/auth.constants';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModel } from '../../shared/constants';
import { AvatarSchema, UsersSchema } from './users.schema';
import { EmailModule } from '../email/emails.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DbModel.Users, schema: UsersSchema },
      { name: DbModel.Avatars, schema: AvatarSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.accessTokenSecret,
      signOptions: { expiresIn: jwtConstants.accessTokenExpiry },
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    forwardRef(() => EmailModule),
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
