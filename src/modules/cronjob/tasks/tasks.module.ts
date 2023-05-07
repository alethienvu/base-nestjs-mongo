import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EmailModule } from 'src/modules/email/emails.module';
import { ScheduleController } from './tasks.controller';

@Module({
  imports: [EmailModule],
  controllers: [ScheduleController],
  providers: [TasksService],
})
export class TasksModule {}
