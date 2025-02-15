import { Module } from '@nestjs/common';
import { ChatWsModule } from './chat-ws/chat-ws.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ObjectStorageModule } from './object-storage/object-storage.module';
import { ConfigModule } from '@nestjs/config';
import { ProductImagesModule } from './product-images/product-images.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ResendModule } from 'nestjs-resend';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ResendModule.forRoot({
      apiKey: process.env.RESEND_API_KEY,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    ChatWsModule,
    ProductsModule,
    CategoriesModule,
    ObjectStorageModule,
    ProductImagesModule,
    UsersModule,
    AuthModule,
    EmailModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
