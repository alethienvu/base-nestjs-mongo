import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Logger, Module } from '@nestjs/common';
import { mailConfig } from 'src/configs/mail.config';
import { EmailService } from './email.service';
import { EmailController } from './emails.controller';
import { EmailRepository } from './emails.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModel } from 'src/shared/constants';
import { IEmailSchema } from './emails.schema';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: mailConfig,
      defaults: {
        from: `"No Reply" <${mailConfig.from}>`,
      },
      template: {
        dir: 'src/modules/email/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MongooseModule.forFeature([{ name: DbModel.Emails, schema: IEmailSchema }]),
  ],
  controllers: [EmailController],
  providers: [EmailService, Logger, EmailRepository],
  exports: [EmailService],
})
export class EmailModule {}
