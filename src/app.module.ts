import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { TasksModule } from './modules/cronjob/tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ShopModule } from './modules/shop/shop.module';
import { UserMiddleware } from './middleware/user.middleware';
import { NotificationModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule,
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
    AuthModule,
    UsersModule,
    AdminsModule,
    EmailModule,
    ScheduleModule.forRoot(),
    TasksModule,
    ShopModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
