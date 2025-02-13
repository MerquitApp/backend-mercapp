import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { RegisterUsersDto } from './dto/register-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      throw new NotFoundException('Invalid password');
    }

    return {
      token: this.jwtService.sign({ user_id: user.user_id }),
      user,
    };
  }

  async getUserToken(user: User): Promise<any> {
    return {
      token: this.jwtService.sign({ user_id: user.user_id }),
    };
  }

  async register(createDto: RegisterUsersDto): Promise<any> {
    const { password, confirmPassword } = createDto;

    if (password.trim() !== confirmPassword.trim()) {
      throw new BadRequestException('Passwords do not match');
    }

    try {
      await this.usersService.createUser(createDto);
    } catch (error) {
      console.log(error);
    }
  }
}
