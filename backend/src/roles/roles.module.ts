import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { DatabasesModule } from 'src/databases/databases.module';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { RolesController } from './roles.controller';
import { UserService } from 'src/user/user.service';
import { RolesPermissionsGuard } from 'src/utils/guards/role-and-permission.guard';

@Module({
  providers: [DatabasesModule, RolesService,
    PrismaDatabaseService,UserService,RolesPermissionsGuard],
  exports: [RolesService],

  controllers: [RolesController],
})
export class RolesModule {}
