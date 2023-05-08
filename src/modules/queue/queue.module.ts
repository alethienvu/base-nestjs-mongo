import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import * as config from 'config';
import Redis from 'ioredis';

const redisQueueEmails: string = config.get('redis.sendEmailQueue');

export const SendEmailQueue = BullModule.registerQueue({
  name: redisQueueEmails,
});

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      createClient: () => {
        return new Redis(
          +config.get('redis.standalone.port'),
          config.get('redis.standalone.host'),
          { maxRetriesPerRequest: null, enableReadyCheck: false },
        );
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
  ],
  providers: [],
  exports: [SendEmailQueue],
})
export class QueuesModule {}
