import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/db/prisma.service';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getAllUser(): Promise<Users[]> {
    return this.prisma.user.findMany();
  }

  async createUser(data: CreateUserDto): Promise<Users> {
    const existing = await this.findByEmail(data.email);
    const hashedPassword = bcrypt.hashSync(data.password, 10);

    if (existing) {
      throw new ConflictException('username already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    });

    const token = this.generateAccountVerificationToken(user);

    await this.emailService.sendAccoutVerificationEmail(data.email, {
      userName: data.name,
      confirmationLink: `${this.configService.get(
        'FRONTEND_URL',
      )}/verify-account/${token}`,
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

  async findById(user_id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  update(user_id: number, updateUserDto: UpdateUserDto) {
    // return `This action updates a #${id} user`;
    throw new HttpException(
      'Error updating user.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async remove(user_id: number) {
    await this.prisma.user.delete({
      where: {
        user_id,
      },
    });
  }

  generateAccountVerificationToken(user: User) {
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

    return user;
  }
}
