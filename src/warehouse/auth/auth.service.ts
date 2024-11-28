import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ name, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    this.usersService.create({
      name: name,
      email: email,
      password: await bcryptjs.hash(password, 10),
      phone_number: '',
      role: '',
      verification_state: false,
      profile_picture: '',
    });

    return {
      name,
      email,
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }

    const payload = { email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
    };
  }

  async profile({ email, role }: { email: string; role: string }) {
    return await this.usersService.findOneByEmail(email);
  }
}
