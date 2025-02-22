import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async create(
    product_id: number,
    createOfferDto: CreateOfferDto,
    user_id: number,
  ): Promise<Offer> {
    try {
      const offer = await this.prisma.offer.create({
        data: {
          user: {
            connect: {
              user_id,
            },
          },
          product: {
            connect: {
              id: product_id,
            },
          },
          price: createOfferDto.price,
        },
        include,
      });

      return offer;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error!');
    }
  }

  async createOrUpdate(
    product_id: number,
    createOfferDto: CreateOfferDto,
    user_id: number,
  ) {
    const offer = await this.prisma.offer.findFirst({
      where: {
        product: {
          id: product_id,
        },
        user: {
          user_id,
        },
      },
    });

    if (offer) {
      this.update(offer.id, createOfferDto);
    } else {
      this.create(product_id, createOfferDto, user_id);
    }

    return offer;
  }

  async findOne(id: number): Promise<Offer> {
    try {
      const offer = await this.prisma.offer.findUnique({
        where: { id },
        include,
      });

      return offer;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error!');
    }
  }

  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    try {
      const offer = await this.prisma.offer.update({
        where: { id },
        data: {
          price: updateOfferDto.price,
        },
        include,
      });

      return offer;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error!');
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.offer.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error!');
    }
  }

  async getOffersByUserId(user_id: number): Promise<Offer[]> {
    try {
      const offers = await this.prisma.offer.findMany({
        where: {
          user: {
            user_id,
          },
        },
        include,
      });
      return offers;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error!');
    }
  }

  async getOffersByProductId(product_id: number): Promise<Offer[]> {
    try {
      const offers = await this.prisma.offer.findMany({
        where: {
          product: {
            id: product_id,
          },
        },
        include,
      });

      return offers;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error!');
    }
  }
}
