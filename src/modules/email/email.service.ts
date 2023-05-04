import { MailerService } from '@nestjs-modules/mailer';
// import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
// import { Queue } from 'bull';
import { mailConfig } from '../../configs/mail.config';
import { EmailDto } from './dto/test-mail.dto';
import { SentMessageInfo } from 'nodemailer';
@Injectable()
export class EmailService {
  constructor(
    // @InjectQueue('mail') private readonly emailQueue: Queue,
    private mailerService: MailerService,
  ) {}

  async sendMail(testMailDto : EmailDto): Promise<SentMessageInfo> {
    await this.mailerService.sendMail({
      from: mailConfig.from,
      to: testMailDto.email,
      subject: testMailDto.subject,
      template: 'signup-email',
      context: {
        email: testMailDto.email,
        content: testMailDto.content,
        bannerLink: `https://i.pinimg.com/originals/99/c8/1f/99c81f02680db118ce8f1580c2276823.jpg`,
      },
    }).then(()=>{
      Logger.log('Send success')
    }).catch((e)=>{
      Logger.error(e)
    });
  }
}
