import { NestFactory } from '@nestjs/core';
import { handleCronjob } from './send-email-cron.helper';
import { SendEmailCronModule } from './send-email-cron.module';
import { EmailService } from 'src/modules/email/email.service';
import { Logger } from '@nestjs/common';

export async function run() {
  Logger.log(null, '🚀🚀🚀 ~ Starting send all email cron jobs ...');
  const app = await NestFactory.createApplicationContext(SendEmailCronModule);
  const emailService = app.get(EmailService);

  try {
    await handleCronjob({ emailService });
  } catch (err) {
    Logger.error(err, `🚀🚀🚀 ~ Error on send all email cron jobs`);
    throw err;
  }
  Logger.log(null, '🚀🚀🚀 ~ Complete send all email cron jobs');
  return app;
}
