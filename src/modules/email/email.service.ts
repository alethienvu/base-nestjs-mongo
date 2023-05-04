import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Queue } from 'bull';
import { mailConfig } from '../../configs/mail.config';
import { EmailDto } from './dto/test-mail.dto';
import * as config from 'config';
import { SentMessageInfo } from 'nodemailer';
import { UsersRepository } from '../users/users.repository';
import { db2api } from 'src/shared/data.prettifier';
import { IUser } from '../users/users.interface';
import { EmailQueueName } from './emails.enum';

const sendEmailQueue: string = config.get('redis.sendEmailQueue');
@Injectable()
export class EmailService {
  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
    @InjectQueue(sendEmailQueue) private readonly emailQueue: Queue,
    private mailerService: MailerService,
  ) {}

  async sendSignupMail(testMailDto: EmailDto): Promise<SentMessageInfo> {
    await this.mailerService
      .sendMail({
        from: mailConfig.from,
        to: testMailDto.email,
        subject: testMailDto.subject,
        template: 'signup-email',
        context: {
          email: testMailDto.email,
          content: testMailDto.content,
          bannerLink: `https://i.pinimg.com/originals/99/c8/1f/99c81f02680db118ce8f1580c2276823.jpg`,
        },
      })
      .then(() => {
        Logger.log('Send success');
      })
      .catch((e) => {
        Logger.error(e);
      });
  }

  async sendAllEmail() {
    const cursor = await this.usersRepository.findWithCursor(
      { email: { $ne: null } },
      { batchSize: 100000 },
    );
    for await (const doc of cursor) {
      const user: IUser = db2api(doc);
      const { email, id } = user;
      await this.emailQueue.add(EmailQueueName.SENDALL, {
        userId: id,
        email,
        content: 'Welcome to our application!!!',
      });
    }
  }
}
