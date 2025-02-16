import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateACLRequest } from 'aws-sdk/clients/memorydb';
import { Reputation } from '@prisma/client';
import { CreateReputationDto } from './dto/create-reputation.dto';

@Injectable()
export class ReputationService {
  constructor(private readonly prisma: PrismaService) {}

  async getReputation(id: number): Promise<any> {
    return await this.prisma.reputation.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createReputation(
    createReputation: CreateReputationDto,
  ): Promise<Reputation> {
    const { score, comment, userId } = createReputation;
    return this.prisma.reputation.create({
      data: {
        score,
        comment,
        userId,
      },
    });
  }

  async updateReputation(id: number, reputation: any): Promise<any> {
    return await this.prisma.reputation.update({
      where: {
        id: id,
      },
      data: reputation,
    });
  }

  async deleteReputation(id: number): Promise<any> {
    return await this.prisma.reputation.delete({
      where: {
        id: id,
      },
    });
  }
} //cierra clase
