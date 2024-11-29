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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    // return `This action updates a #${id} user`;
    throw new HttpException(
      'Error updating user.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  remove(id: number) {
    // return `This action removes a #${id} user`;
    throw new Error('Method not implemented.');
  }
}
