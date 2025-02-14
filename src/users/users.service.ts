import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { createOauthUserDto } from './dto/create-user-oauth.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUser(): Promise<Users[]> {
    return this.prisma.user.findMany();
  }

  async createUser(data: CreateUserDto): Promise<Users> {
    const existing = await this.findByEmail(data.email);
    const hashedPassword = bcrypt.hashSync(data.password, 10);

    if (existing) {
      throw new ConflictException('username already exists');
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        phone_number: data.phoneNumber,
      },
    });
  }

  async createOrFindOauthUser(data: createOauthUserDto): Promise<Users> {
    const existing = await this.findByEmail(data.email);

    if (existing) {
      return existing;
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        profile_picture: data.profile_picture,
      },
    });
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

  async remove(user_id: number) {
    await this.prisma.user.delete({
      where: {
        user_id,
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
}
