import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { PrismaService } from 'src/common/db/prisma.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [OfferController],
  providers: [OfferService, PrismaService],
  imports: [NotificationsModule, ProductsModule],
})
export class OfferModule {}
