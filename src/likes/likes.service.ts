import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserLikes(user_id: number) {
    return await this.prisma.like.findMany({
      where: {
        userId: user_id,
      },
      include: {
        product: true,
      },
    });
  }

  async getIsProductLiked(user_id: number, product_id: number) {
    const like = await this.prisma.like.findFirst({
      where: {
        userId: user_id,
        productId: product_id,
      },
    });

    return Boolean(like);
  }

  async createLike(user_id: number, product_id: number) {
    const isLiked = await this.getIsProductLiked(user_id, product_id);

    if (isLiked) {
      throw new BadRequestException('You already liked this product');
    }

    return await this.prisma.like.create({
      data: {
        userId: user_id,
        productId: product_id,
      },
    });
  }

  async deleteUserLike(user_id: number, product_id: number) {
    return await this.prisma.like.deleteMany({
      where: {
        userId: user_id,
        productId: product_id,
      },
    });
  }
}
