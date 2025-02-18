import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaService } from '../common/db/prisma.service';

@Module({
  controllers: [LikesController],
  providers: [LikesService, PrismaService],
  exports: [LikesService],
})
export class LikesModule {}
