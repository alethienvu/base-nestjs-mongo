import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/modules/email/emails.module';
import { UsersModule } from 'src/modules/users/users.module';
import { createMongooseOptions } from 'src/shared/helpers';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => createMongooseOptions('mongodb.uri'),
    }),
    EmailModule,
    forwardRef(() => UsersModule),
  ],
})
export class SendEmailCronModule {}
