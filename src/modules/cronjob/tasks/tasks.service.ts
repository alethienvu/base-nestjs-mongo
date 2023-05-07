import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { EmailService } from 'src/modules/email/email.service';
import { TaskName, TimeZone } from './tasks.enum';

@Injectable()
export class TasksService {
  constructor(
    private readonly mailService: EmailService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    name: TaskName.NOTIFICATIONS,
    timeZone: TimeZone.VN,
  })
  sendNotiCron() {
    console.log('🚀🚀🚀 ~ start run task notifications');
    // this.mailService.sendAllEmail();
  }

  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    const runningJobs = {};
    jobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDates().toJSDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      runningJobs[key] = value.running;
      console.log(`🚀🚀🚀 ~ job: ${key} -> next: ${next}`);
    });
    return runningJobs;
  }

  stopJob(taskName: TaskName) {
    const job = this.schedulerRegistry.getCronJob(taskName);
    job.stop();
    console.log(`🚀🚀🚀 ~ Stopped ~ Last date: ${job.lastDate()}`);
  }

  restartJob(taskName: TaskName) {
    const job = this.schedulerRegistry.getCronJob(taskName);
    job.start();
    console.log(`🚀🚀🚀 ~ Started ~ Next date: ${job.nextDate()}`);
  }
}
