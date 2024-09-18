// src/schedule/my-scheduled-task.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FtpService } from '../ftp/ftp.service';

@Injectable()
export class MyScheduledTask {
  constructor(private readonly ftpService: FtpService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    try {
      const files = await this.ftpService.listFiles('/path/to/csv');
      for (const file of files) {
        await this.ftpService.processCsv(`/path/to/csv/${file}`);
      }
    } catch (err) {
      console.error('Error during scheduled task:', err);
    }
  }
}
