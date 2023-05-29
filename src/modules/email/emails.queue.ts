import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { getConfig } from '../config/config.provider';
import { EmailService } from './email.service';
import { errorLog, infoLog } from 'src/shared/logger';
import { EmailQueueName } from './emails.enum';
import { EmailRepository } from './emails.repository';

const config = getConfig();
const redisQueue: string = config.get('redis.sendEmailQueue');

@Processor(redisQueue)
export class SendEmailQueueJob {
  constructor(
    private readonly emailsService: EmailService,
    private readonly _emailRepository: EmailRepository,
  ) {}

  @Process({ name: EmailQueueName.SENDALL })
  async sendSignUpEmail(
    job: Job<{
      userId: string;
      email: string;
      content: string;
    }>,
  ) {
    // Save log email was sent
    // this._emailRepository.save({ userId: job.data.userId, email: job.data.email, status: 'SEND' });
    return this.emailsService.sendSignupMail({
      subject: `[SIGNUP SUCCESS]: Welcome to Limall`,
      email: job.data.email,
      content: job.data.content,
    });
  }

  @OnQueueActive()
  onActive(job: Job) {
    infoLog(`🚀🚀🚀 ~ Processing job ${job.name}:${job.id}...`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    infoLog(
      `🚀🚀🚀 ~ Completed job ${job.name}: ${job.id}. Send email success to ${job.data.email}`,
    );
  }

  @OnQueueFailed()
  onFailed(job: Job) {
    errorLog(`🚀🚀🚀 ~ Failed job ${job.name}: ${job.id}. Failed reason: ${job.failedReason}`);
  }
}
