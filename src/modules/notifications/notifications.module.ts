import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModel } from 'src/shared/constants';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsSchema } from './notifications.schema';
import { NotificationsService } from './notifications.service';
import { SendNotificationQueueJob } from './notifications.queue';
import { QueuesModule } from '../queue/queue.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DbModel.Subcriptions, schema: NotificationsSchema }]),
    QueuesModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepository, SendNotificationQueueJob],
  exports: [NotificationsService, SendNotificationQueueJob],
})
export class NotificationModule {}
