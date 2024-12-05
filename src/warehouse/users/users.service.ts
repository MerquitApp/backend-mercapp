import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUser(): Promise<Users[]> {
    return this.prisma.user.findMany();
  }

  async createUser(data: Users): Promise<Users> {
    const existing = await this.prisma.user.findUnique({
      where: {
        user_id: data.user_id,
      },
    });

    if (existing) {
      throw new ConflictException('username already exists');
    }

    return this.prisma.user.create({
      data,
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(user_id: number) {
    return `This action returns a #${user_id} user`;
  }

  update(user_id: number, updateUserDto: UpdateUserDto) {
    // return `This action updates a #${id} user`;
    throw new HttpException(
      'Error updating user.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async remove(user_id: number) {
    // return `This action removes a #${id} user`;
    const user = this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.user.delete({
      where: {
        user_id,
      },
    });
  }
}
