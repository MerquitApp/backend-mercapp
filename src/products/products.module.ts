import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { ObjectStorageModule } from 'src/object-storage/object-storage.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductImagesModule } from 'src/product-images/product-images.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [ObjectStorageModule, CategoriesModule, ProductImagesModule],
})
export class ProductsModule {}
