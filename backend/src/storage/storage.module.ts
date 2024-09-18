import { Module } from '@nestjs/common';
// import { StorageService } from './storage.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [ MulterModule.register({
    dest: './uploads', // Set your upload destination
  }),],
  // providers: [StorageService],
  // exports: [StorageService],
})
export class StorageModule {}
