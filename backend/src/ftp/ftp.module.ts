import { Module } from '@nestjs/common';
import { FtpService } from './ftp.service';
 
import { DatabasesModule } from 'src/databases/databases.module';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';

@Module({
   
 
  providers: [FtpService,DatabasesModule,
    PrismaDatabaseService,],
})
export class FtpModule {}
