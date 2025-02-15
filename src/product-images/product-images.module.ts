import { Module } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { PrismaService } from 'src/common/db/prisma.service';
import { ObjectStorageModule } from 'src/object-storage/object-storage.module';

@Module({
  providers: [ProductImagesService, PrismaService],
  exports: [ProductImagesService],
  imports: [ObjectStorageModule],
})
export class ProductImagesModule {}
