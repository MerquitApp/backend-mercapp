import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: number, productId: number) {
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
