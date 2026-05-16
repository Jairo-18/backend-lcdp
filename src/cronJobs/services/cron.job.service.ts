import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { BackupUC } from '../../backup/useCases/backup.uc';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);
  private isBackupRunning = false;

  constructor(
    private readonly _backupUC: BackupUC,
    private readonly _configService: ConfigService,
  ) {}

  @Cron('* * * * *')
  async handleDailyBackup() {
    if (this._configService.get<string>('app.env') !== 'production') return;

    if (this.isBackupRunning) {
      this.logger.warn('Backup ya en ejecución, se omite esta iteración');
      return;
    }

    this.isBackupRunning = true;
    try {
      await this._backupUC.performBackupAndUpload();
      this.logger.log(
        `[${new Date().toISOString()}] Backup generado y subido a Google Drive correctamente`,
      );
    } catch (error) {
      this.logger.error(`Backup fallido: ${error.message}`, error.stack);
    } finally {
      this.isBackupRunning = false;
    }
  }
}
