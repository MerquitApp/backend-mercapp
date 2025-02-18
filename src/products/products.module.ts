import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/common/db/prisma.service';
import { ObjectStorageModule } from 'src/object-storage/object-storage.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductImagesModule } from 'src/product-images/product-images.module';
import { LikesModule } from 'src/likes/likes.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [
    ObjectStorageModule,
    CategoriesModule,
    ProductImagesModule,
    LikesModule,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
