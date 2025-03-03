import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'src/common/db/prisma.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
  exports: [OrdersService],
  imports: [NotificationsModule, ProductsModule],
})
export class OrdersModule {}
