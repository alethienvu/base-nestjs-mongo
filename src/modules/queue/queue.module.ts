import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import * as config from 'config';
import Redis from 'ioredis';
import { redisConfig } from '../../configs/redis.config';

const redisQueueEmails: string = config.get('redis.sendEmailQueue');
const sendNotifications: string = config.get('redis.sendNotificationsQeueu');

export const SendEmailQueue = BullModule.registerQueue({
  name: redisQueueEmails,
});
export const SendNotificationsQueue = BullModule.registerQueue({
  name: sendNotifications,
});

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      createClient: () => {
        return new Redis(redisConfig.port, redisConfig.host, {
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
          password: redisConfig.pass,
        });
      },
      prefix: 'REDIS_QUEUE_',
      defaultJobOptions: {
        attempts: 3,
      },
      settings: {
        lockDuration: 200000,
      },
    }),
    SendEmailQueue,
    SendNotificationsQueue,
  ],
  providers: [],
  exports: [SendEmailQueue, SendNotificationsQueue],
})
export class QueuesModule {}
