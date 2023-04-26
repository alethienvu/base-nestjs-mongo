import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './modules/config/config.module';
import { LoggerModule } from 'nestjs-pino';
import * as pino from 'pino';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongooseOptions } from './shared/helpers';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
