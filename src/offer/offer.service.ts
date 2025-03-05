import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PrismaService } from 'src/common/db/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ProductsService } from 'src/products/products.service';

const include = {
  user: true,
  product: {
    include: {
      images: true,
      cover_image: true,
    },
  },
};

type Offer = Prisma.OfferGetPayload<{
  include: {
    user: true;
    product: {
      include: {
        images: true;
        cover_image: true;
      };
    };
  };
}> & {
  user: {
    user_id: number;
    email: string;
  };
};

@Injectable()
export class OfferService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async create(
    product_id: number,
    createOfferDto: CreateOfferDto,
    user_id: number,
  ): Promise<Offer> {
    const product = await this.productsService.getProductById(product_id);

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

      await this.notificationsService.createNotification(
        product.userId,
        `¡Tienes una oferta para ${product.name}!`,
      );

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

  async accept(id: number, user_id: number) {
    const offer = await this.findOne(id);
    const isAllowed = offer.product.userId === user_id;

    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    await this.notificationsService.createNotification(
      offer.userId,
      `Tu oferta de ${offer.product.name} ha sido aceptada`,
    );

    await this.prisma.offer.update({
      where: {
        id,
      },
      data: {
        status: 'accepted',
      },
    });
  }

  async reject(id: number, user_id: number) {
    const offer = await this.findOne(id);
    const isAllowed = offer.product.userId === user_id;

    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    await this.notificationsService.createNotification(
      offer.userId,
      `Tu oferta de ${offer.product.name} ha sido rechazada`,
    );

    await this.prisma.offer.update({
      where: {
        id,
      },
      data: {
        status: 'declined',
      },
    });
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

  async getUserProductOffer(
    user_id: number,
    product_id: number,
  ): Promise<Offer> {
    try {
      const offer = await this.prisma.offer.findFirst({
        where: {
          product: {
            id: product_id,
          },
          user: {
            user_id,
          },
        },
        include,
      });

      return offer;
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

  async getSellerOffers(user_id: number): Promise<Offer[]> {
    try {
      const offers = await this.prisma.offer.findMany({
        where: {
          product: {
            userId: user_id,
          },
          status: 'pending',
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
