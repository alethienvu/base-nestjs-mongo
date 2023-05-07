import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/auth.constants';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModel } from '../../shared/constants';
import { EmailModule } from '../email/emails.module';
import { ShopSchema } from './shop.schema';
import { ShopRepository } from './shop.repository';
import { ShopService } from './shop.service';
import { UsersModule } from '../users/users.module';
import { ShopController } from './shop.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DbModel.Shop, schema: ShopSchema }]),
    JwtModule.register({
      secret: jwtConstants.accessTokenSecret,
      signOptions: { expiresIn: jwtConstants.accessTokenExpiry },
    }),
    EmailModule,
    UsersModule,
  ],
  providers: [ShopService, ShopRepository],
  exports: [ShopService, ShopRepository],
  controllers: [ShopController],
})
export class ShopModule {}
