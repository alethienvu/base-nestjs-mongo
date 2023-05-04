import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { LoggerModule } from 'nestjs-pino';
import * as pino from 'pino';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongooseOptions } from './shared/helpers';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmailModule } from './modules/email/emails.module';
import { AdminsModule } from './modules/admin/admins.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    UsersModule,
    AdminsModule,
    LoggerModule.forRootAsync({
      useFactory: async () => {
        return {
          pinoHttp: {
            serializers: {
              err: pino.stdSerializers.err,
              req: (req) => {
                req.body = req.raw.body;
                return req;
              },
            },
            autoLogging: false,
          },
        };
      },
    }),
    MongooseModule.forRootAsync({
      useFactory: () => createMongooseOptions('mongodb.uri'),
    }),
    EmailModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
