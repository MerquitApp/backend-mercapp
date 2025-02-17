import { Module } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { ReputationController } from './reputation.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ReputationService, PrismaService],
  controllers: [ReputationController],
})
export class ReputationModule {}
