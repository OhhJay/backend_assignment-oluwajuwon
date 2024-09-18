import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabasesModule } from 'src/databases/databases.module';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';

@Module({
  controllers: [UserController],
  providers: [UserService,DatabasesModule,PrismaDatabaseService],
   
 
})
export class UserModule {}
