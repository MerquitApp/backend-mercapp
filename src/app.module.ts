import { Module } from '@nestjs/common';
import { ChatWsModule } from './chat-ws/chat-ws.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ObjectStorageModule } from './object-storage/object-storage.module';
import { ConfigModule } from '@nestjs/config';
import { ProductImagesModule } from './product-images/product-images.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ChatWsModule,
    ProductsModule,
    CategoriesModule,
    ObjectStorageModule,
    ConfigModule.forRoot(),
    ProductImagesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
