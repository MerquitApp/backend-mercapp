import { Injectable } from '@nestjs/common';
import { Reputation } from '@prisma/client';
import { CreateReputationDto } from './dto/create-reputation.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';

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
    user: User,
  ): Promise<Reputation> {
    const { score, comment } = createReputation;
    return this.prisma.reputation.create({
      data: {
        score,
        comment,
        user: {
          connect: {
            user_id: user.user_id,
          },
        },
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
