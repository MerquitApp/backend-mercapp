import { Module } from '@nestjs/common';
import { ChatWsModule } from './chat-ws/chat-ws.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ObjectStorageModule } from './object-storage/object-storage.module';
import { ConfigModule } from '@nestjs/config';
import { ProductImagesModule } from './product-images/product-images.module';

@Module({
  imports: [
    ChatWsModule,
    ProductsModule,
    CategoriesModule,
    ObjectStorageModule,
    ConfigModule.forRoot(),
    ProductImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
