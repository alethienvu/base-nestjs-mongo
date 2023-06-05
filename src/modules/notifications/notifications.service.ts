import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { CreateSubcriptionsDto, INotifs, ISubcriptions } from './notifications.interface';
import { getConfig } from '../config/config.provider';
import * as webpush from 'web-push';
import { db2api } from 'src/shared/data.prettifier';
import { NotificationQeueuName } from './notifications.enum';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { errorLog, infoLog } from 'src/shared/logger';
const config = getConfig();
const sendNotificationsQueue: string = config.get('redis.sendNotificationsQeueu');
@Injectable()
export class NotificationsService {
  constructor(
    private readonly _notificationsRepository: NotificationsRepository,
    @InjectQueue(sendNotificationsQueue) private readonly _sendNotificationQueueJob: Queue,
  ) {}

  async addSubcription(createSubcriptionsDto: CreateSubcriptionsDto) {
    console.log(`\nSubscribing ${createSubcriptionsDto.endpoint}...\n`);
    return await this._notificationsRepository.save(createSubcriptionsDto);
  }

  async removeSubcription(createSubcriptionsDto: CreateSubcriptionsDto) {
    console.log(`\nUnsubscribing ${createSubcriptionsDto.endpoint}\n`);
    const sub = await this._notificationsRepository.findOne({
      enpoint: createSubcriptionsDto.endpoint,
    });
    if (sub) {
      return await this._notificationsRepository.deleteOne(sub.id);
    }
  }

  async sendNotifications(sub: ISubcriptions) {
    const notification = JSON.stringify({
      title: 'Notifications from Sunfor!',
      options: {
        body: `Please give me a star on: https://github.com/alethienvu/sunfor-fe`,
      },
    });
    const vapidDetails = {
      publicKey: config.get('notification.publicKey'),
      privateKey: config.get('notification.privateKey'),
      subject: 'mailto:test@test.test',
    };
    const options = {
      TTL: 60 * 60 * 1000,
      vapidDetails: vapidDetails,
    };

    webpush
      .sendNotification(sub, notification, options)
      .then((result) => {
        infoLog(`\nsendNotification result:\n ${result.statusCode}`);
      })
      .catch((error) => {
        errorLog(`\nsendNotification error:\n ${error} `);
      });
  }

  /**
   * Send all notification by queue
   * TODO: dynamic input,...
   */
  async notifyAll() {
    const cursor = await this._notificationsRepository.findWithCursor(
      { endpoint: { $ne: null } },
      { batchSize: 100000 },
    );
    for await (const doc of cursor) {
      const sub: INotifs = db2api(doc);
      await this._sendNotificationQueueJob.add(NotificationQeueuName.SENDALL, {
        sub,
      });
    }
  }
}
