import { Module } from '@nestjs/common';
import { SampleDataService } from './sample-data.service';

import { DatabasesModule } from 'src/databases/databases.module';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service'; 
import { UserService } from 'src/user/user.service';
import { RolesPermissionsGuard } from 'src/utils/guards/role-and-permission.guard';

import { SampleDataController } from './sample-data.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports:[
    MulterModule.register({
      dest: './uploads', // Set your upload destination
    }),
  ],
  controllers: [SampleDataController],
  providers: [SampleDataService,DatabasesModule,
    PrismaDatabaseService,UserService,RolesPermissionsGuard],
})
export class SampleDataModule {}
