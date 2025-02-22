import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PrismaService } from 'src/common/db/prisma.service';
import { Prisma } from '@prisma/client';

const include = {
  user: true,
};

type Offer = Prisma.OfferGetPayload<{
  include: {
    user: true;
  };
}> & {
  user: {
    user_id: number;
    email: string;
  };
};

@Injectable()
export class OfferService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOfferDto: CreateOfferDto, user_id: number): Promise<Offer> {
    return this.prisma.offer.create({
      data: {
        user: {
          connect: {
            user_id,
          },
        },
        product: {
          connect: {
            id: createOfferDto.product_id,
          },
        },
        price: createOfferDto.price,
      },
      include,
    });
  }

  findOne(id: number) {
    return this.prisma.offer.findUnique({
      where: { id },
      include,
    });
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return this.prisma.offer.update({
      where: { id },
      data: {
        product: {
          connect: {
            id: updateOfferDto.product_id,
          },
        },
        price: updateOfferDto.price,
      },
      include,
    });
  }

  remove(id: number) {
    return this.prisma.offer.delete({
      where: { id },
    });
  }

  getOffersByUserId(user_id: number): Promise<Offer[]> {
    return this.prisma.offer.findMany({
      where: {
        user: {
          user_id,
        },
      },
      include,
    });
  }

  getOffersByProductId(product_id: number): Promise<Offer[]> {
    return this.prisma.offer.findMany({
      where: {
        product: {
          id: product_id,
        },
      },
      include,
    });
  }
}
