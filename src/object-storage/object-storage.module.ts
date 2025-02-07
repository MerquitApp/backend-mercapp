import { Module } from '@nestjs/common';
import { ObjectStorageService } from './object-storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [ObjectStorageService],
  exports: [ObjectStorageService],
  imports: [ConfigModule],
})
export class ObjectStorageModule {}
