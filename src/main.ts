import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import * as configBase from 'config';
import { getConfig, getHost } from './modules/config/config.provider';
import { createLightship } from 'lightship';
import * as httpContext from 'express-http-context';
import * as express from 'express';
import * as responseTime from 'response-time';
import { LoggerInterceptor } from './interceptor/logger.interceptor';
import { v4 as uuidV4 } from 'uuid';
import { initializeSwagger } from './shared/swagger.helper';
import { CORS_EXPOSED_HEADERS } from './shared/constants';

const config = getConfig();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const logger = app.get(Logger);

  app.useLogger(logger);

  initializeApp(app);

  await initializeSwagger(app);

  const lightship = await initializeLightship(app);

  await app.listen(config.get<number>('server.port'));

  lightship.signalReady();
}

function initializeApp(app: INestApplication) {
  app.use(httpContext.middleware);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(responseTime({ header: 'x-response-time' }));
  app.enableCors({
    exposedHeaders: CORS_EXPOSED_HEADERS,
  });
  app.use((req: express.Request, res: express.Response, next: () => void) => {
    const correlationId = uuidV4();
    httpContext.set('timestamp', Date.now());
    httpContext.set('correlationId', correlationId);
    req['id'] = correlationId;
    next();
  });
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );
  app.setGlobalPrefix(config.get('service.baseUrl'));
}

async function initializeLightship(app: INestApplication) {
  const lightship = await createLightship();

  lightship.registerShutdownHandler(async () => {
    await app.close();
  });

  return lightship;
}

bootstrap()
  .then(() => {
    const hostname = getHost();
    console.log(` 💗💗💗 Started on http://${hostname}${configBase.get('service.baseUrl')}`);
    console.log(
      ` 💻💻💻 Docs available on http://${hostname}${configBase.get('service.docsBaseUrl')}`,
    );
  })
  .catch((error) => {
    console.error('💀💀💀 Bootstrap starting error ', error);
  });
