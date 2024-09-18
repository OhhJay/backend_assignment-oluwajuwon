import { PrismaClient } from '@prisma/client';
import {
  INestApplication,
  INestMicroservice,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class PrismaDatabaseService
  extends PrismaClient
  implements OnModuleInit
{
  isVerifiedUser(userId: any) {
    throw new Error('Method not implemented.');
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  // async enableShutdownHooks(
  //   app: INestMicroservice | INestApplication,
  // ): Promise<void> { 
  //   this.$on('beforeExit' as any, async () => {
  //     await app.close();
  //   });
  // }
}
