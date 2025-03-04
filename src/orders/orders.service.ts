import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationsService,
    private readonly productsService: ProductsService,
  ) {}

  async createOrder(userId: number, productId: number) {
    const product = await this.productsService.getProductById(productId);

    if (!product.isActive) {
      throw new BadRequestException('Product is not active');
    }

    await this.notificationService.createNotification(
      product.userId,
      `¡Has vendido ${product.name}!`,
    );

    return this.prisma.order.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async getOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteOrder(id: number) {
    return this.prisma.order.delete({
      where: {
        id,
      },
    });
  }

  async getOrderByUserIdAndProductId(userId: number, productId: number) {
    return this.prisma.order.findUnique({
      where: {
        userId,
        productId,
      },
    });
  }

  async updateOrder(id: number, orderUpdate: Partial<Order>) {
    const order = await this.getOrderById(id);

    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        ...order,
        ...orderUpdate,
      },
    });
  }

  async getOrdersByUserId(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });
  }
}
