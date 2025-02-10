import { Injectable, Inject } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('STRIPE_CLIENT')
    private readonly stripeClient: Stripe,
  ) {}

  async getPayments() {
    const session = await this.stripeClient.checkout.sessions.create({
      line_items: [{ price: 'price_1QSbsQPakj06nw4DAei8ZUw7', quantity: 1 }],
      mode: 'payment',
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      customer: 'cus_RLIXHPZdU8RF6K',
      success_url:
        'http://localhost:3000' +
        '/pay/success/checkout/session?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000' + '/pay/failed/checkout/session',
    });

    return session;
  }

  async SuccessSession(Session: any) {
    console.log(Session);
  }
}
