import { Module } from '@nestjs/common';
import { ChatWsModule } from './chat-ws/chat-ws.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ObjectStorageModule } from './object-storage/object-storage.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductImagesModule } from './product-images/product-images.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailServiceModule } from './email-service/email-service.module';
import { ResendModule } from 'nestjs-resend';

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
    EmailServiceModule,
    ResendModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get('RESEND_API_KEY'),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
