import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CreateOauthUserDto } from './dto/create-user-oauth.dto';
import { ChatService } from 'src/chat/chat.service';
import { ProductsService } from 'src/products/products.service';
import { ReputationService } from 'src/reputation/reputation.service';

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    chats: true;
    products: true;
    orders: true;
  };
}>;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
    private readonly productsService: ProductsService,
    private readonly reputationService: ReputationService,
  ) {}

  async getAllUser(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(data.email);
    const hashedPassword = bcrypt.hashSync(data.password, 10);

    const isOauthAccount = existing.github_id || existing.google_id;

    if (existing && !isOauthAccount) {
      throw new ConflictException('username already exists');
    }

    let user;

    if (isOauthAccount) {
      user = this.prisma.user.update({
        where: {
          email: data.email,
        },
        data: {
          password: hashedPassword,
          phone_number: data.phoneNumber,
        },
      });
    } else {
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
          phone_number: data.phoneNumber,
        },
      });

      const token = this.generateAccountToken(user);

      await this.emailService.sendAccoutVerificationEmail(data.email, {
        userName: data.name,
        confirmationLink: `${this.configService.get(
          'FRONTEND_URL',
        )}/verify-account/${token}`,
      });
    }

    return user;
  }

  async createOauthUser(data: CreateOauthUserDto) {
    const existing = await this.findByEmail(data.email);

    if (existing) {
      throw new ConflictException('username already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        profile_picture: data.profile_picture,
        github_id: data.github_id,
        google_id: data.google_id,
      },
    });

    return user;
  }

  async findUserByGithubId(github_id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        github_id,
      },
    });

    return user;
  }

  async findUserByGoogleId(google_id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        google_id,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    try {
      const result = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      return result;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async findById(user_id: number): Promise<UserWithRelations | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
      include: {
        chats: true,
        products: true,
        orders: true,
      },
    });

    return user;
  }

  async remove(user_id: number) {
    try {
      const user = await this.findById(user_id);

      if (!user) {
        throw new NotFoundException('No se encontró el usuario.');
      }

      user.chats.forEach(async ({ id }) => {
        await this.chatService.deleteById(id);
      });

      user.products.forEach(async ({ id }) => {
        this.productsService.deleteProduct(id, user);
      });

      await this.prisma.user.delete({
        where: {
          user_id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error al eliminar el usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  generateAccountToken(user: User) {
    return this.jwtService.sign({
      user_id: user.user_id,
      email: user.email,
    });
  }

  async verifyAccount(token: string) {
    const { user_id, email } = this.jwtService.verify(token);
    const user = await this.prisma.user.findUnique({
      where: {
        user_id,
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: {
        user_id,
      },
      data: {
        verification_state: true,
      },
    });
  }

  async update(user_id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        user_id,
      },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        phone_number: updateUserDto.phoneNumber,
      },
    });

    return user;
  }

  async passwordReset(user_id: number, newPassword: string) {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const user = await this.prisma.user.update({
      where: {
        user_id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return user;
  }

  async getUserSales(user_id: number) {
    return this.prisma.order.findMany({
      where: {
        product: {
          userId: user_id,
        },
      },
    });
  }

  async getProfile(user_id: number) {
    const user = await this.findById(user_id);
    const userSales = await this.getUserSales(user_id);
    const reputation = await this.reputationService.getUserReputation(user_id);

    return {
      products: user.products,
      avatar: user.profile_picture,
      name: user.name,
      numberOfSales: userSales.length,
      numberOfOrders: user.orders.length,
      ...reputation,
    };
  }
}
