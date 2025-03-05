import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('STRIPE_CLIENT')
    private readonly stripeClient: Stripe,
    private readonly configService: ConfigService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  private async createStripeCustomer(userId: number) {
    const user = await this.usersService.findById(userId);

    const customer = await this.stripeClient.customers.create({
      email: user.email,
      name: user.name,
    });

    return customer;
  }

  private async getStripeCustomer(userId: number) {
    const user = await this.usersService.findById(userId);

    const customer = await this.stripeClient.customers.search({
      query: `email:'${user.email}'`,
    });

    return customer;
  }

  private async createStripeProduct(product_id: number, user_id: number) {
    const product = await this.productsService.getProductById(
      product_id,
      user_id,
    );

    const stripeProduct = await this.stripeClient.products.create({
      name: product.name,
      description: product.description,
      images: [product.cover_image.image],
      default_price_data: {
        currency: 'EUR',
        unit_amount: product.price * 100,
        tax_behavior: 'inclusive',
      },
      metadata: {
        product_id: product.id,
      },
    });

    return stripeProduct;
  }

  private async getStripeProduct(product_id: number, user_id: number) {
    const product = await this.productsService.getProductById(
      product_id,
      user_id,
    );

    const stripeProduct = await this.stripeClient.products.search({
      query: `metadata['product_id']:'${product.id} AND amount=${product.price}'`,
    });

    return stripeProduct;
  }

  async createPayment(userId: number, productId: number) {
    let product = (await this.getStripeProduct(productId, userId))?.[0];
    let customer = (await this.getStripeCustomer(userId))?.[0];

    if (!customer) {
      customer = await this.createStripeCustomer(userId);
    }

    if (!product) {
      product = await this.createStripeProduct(productId, userId);
    }

    let order = await this.ordersService.getOrderByUserIdAndProductId(
      userId,
      productId,
    );

    if (!order) {
      order = await this.ordersService.createOrder(userId, productId);
    }

    const session = await this.stripeClient.checkout.sessions.create({
      line_items: [{ price: product.default_price, quantity: 1 }],
      mode: 'payment',
      customer: customer.id,
      payment_intent_data: {
        setup_future_usage: 'off_session',
      },
      metadata: {
        user_id: userId,
        product_id: productId,
        order_id: order.id,
      },
      success_url: `${this.configService.get(
        'API_URL',
      )}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get(
        'API_URL',
      )}/api/payments/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    return session;
  }

  async successSession(sessionId: string) {
    const session = await this.stripeClient.checkout.sessions.retrieve(
      sessionId,
    );
    const user = await this.usersService.findById(+session.metadata.user_id);

    await this.ordersService.updateOrder(+session.metadata.order_id, {
      status: 'paid',
    });

    await this.productsService.deactivateProduct(+session.metadata.product_id);

    await this.emailService.sendOrderConfirmationEmail(user.email, {
      userName: user.name,
      orderNumber: session.metadata.order_id,
      orderDate: new Date().toLocaleDateString(),
      orderTotal: session.amount_total / 100,
      orderLink: `${this.configService.get('FRONTEND_URL')}/profile/products`,
    });
  }

  async cancelSession(sessionId: string) {
    const session = await this.stripeClient.checkout.sessions.retrieve(
      sessionId,
    );

    this.ordersService.updateOrder(+session.metadata.product_id, {
      status: 'canceled',
    });
  }
}
