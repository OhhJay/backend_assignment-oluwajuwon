import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { DatabasesModule } from 'src/databases/databases.module';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { RolesPermissionsGuard } from 'src/utils/guards/role-and-permission.guard';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [DatabasesModule,PermissionsService,PrismaDatabaseService,RolesPermissionsGuard,UserService],
  controllers: [PermissionsController]
})
export class PermissionsModule {}
