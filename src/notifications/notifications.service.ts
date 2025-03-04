import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(userId: number, message: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
  }

  async getNotificationsByUserId(userId: number) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
    });
  }

  async deleteNotification(id: number) {
    return this.prisma.notification.delete({
      where: {
        id,
      },
    });
  }
}
