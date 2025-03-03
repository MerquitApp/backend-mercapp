import { Module } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { ReputationController } from './reputation.controller';
import { PrismaService } from 'src/common/db/prisma.service';

@Module({
  providers: [ReputationService, PrismaService],
  controllers: [ReputationController],
  exports: [ReputationService],
})
export class ReputationModule {}
