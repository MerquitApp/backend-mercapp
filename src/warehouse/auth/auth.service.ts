import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { RegisterUsersDto } from './dto/register-user.dto';
import { Users } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { user_id, password } = loginDto;

    const users = await this.prismaService.user.findUnique({
      where: { user_id },
    });

    if (!users) {
      throw new NotFoundException('user not found');
    }

    const validatePassword = await bcrypt.compare(password, users.password);

    if (!validatePassword) {
      throw new NotFoundException('Invalid password');
    }

    return {
      token: this.jwtService.sign({ user_id }),
    };
  }
  async register(createDto: RegisterUsersDto): Promise<any> {
    const createUser = new Users();
    createUser.name = createDto.name;
    createUser.email = createDto.email;
    createUser.password = await bcrypt.hash(createDto.password, 10);

    const user = await this.usersService.createUser(createUser);

    return {
      token: this.jwtService.sign({ user_id: user.user_id }),
    };
  }
}
