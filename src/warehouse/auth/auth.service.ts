import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const users = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!users) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const validatePassword = await bcrypt.compare(password, users.password);

    if (!validatePassword) {
      throw new NotFoundException('Contraseña invalida');
    }

    return {
      token: this.jwtService.sign({ email }),
    };
  }
}
