import { Global, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
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
