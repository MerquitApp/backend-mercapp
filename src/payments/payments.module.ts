import { Global, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import Stripe from 'stripe';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ProductsModule } from 'src/products/products.module';
import { OrdersModule } from 'src/orders/orders.module';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    ProductsModule,
    OrdersModule,
    UsersModule,
    EmailModule,
  ],
  providers: [
    PaymentsService,
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const stripeSecretKey = configService.get<string>('STRIPE_SECRET_KEY');
        return new Stripe(stripeSecretKey, {});
      },
      inject: [ConfigService],
    },
  ],
  controllers: [PaymentsController],
  exports: ['STRIPE_CLIENT'],
})
export class PaymentsModule {}
