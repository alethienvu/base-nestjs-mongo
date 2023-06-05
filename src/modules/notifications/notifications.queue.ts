import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { getConfig } from '../config/config.provider';
import { errorLog } from 'src/shared/logger';
import { NotificationQeueuName } from './notifications.enum';
import { NotificationsService } from './notifications.service';
import { INotifs } from './notifications.interface';

const config = getConfig();
const notificationQeueu: string = config.get('redis.sendNotificationsQeueu');

@Processor(notificationQeueu)
export class SendNotificationQueueJob {
  constructor(private readonly _notificationService: NotificationsService) {}

  @Process({ name: NotificationQeueuName.SENDALL })
  async sendAll(
    job: Job<{
      sub: INotifs;
    }>,
  ) {
    return this._notificationService.sendNotifications(job.data.sub);
  }

  @OnQueueFailed()
  onFailed(job: Job) {
    errorLog(`🚀🚀🚀 ~ Failed job ${job.name}: ${job.id}.\n Failed reason: ${job.failedReason}`);
  }
}
