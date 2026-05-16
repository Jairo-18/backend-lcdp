import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BackupModule } from '../backup/backup.module';
import { CronJobService } from './services/cron.job.service';

@Module({
  imports: [BackupModule, ConfigModule],
  providers: [CronJobService],
})
export class CronJobModule {}
