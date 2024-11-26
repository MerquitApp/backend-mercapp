import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterUsersDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: Prismaservice,
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const users = await this.prismaService.users.findUnique({
      where: { username },
    });

    if (!users) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const validatePassword = await bcrypt.compare(password, users.password);

    if (!validatePassword) {
      throw new NotFoundException('Contraseña invalida');
    }

    return {
      token: this.jwtService.sign({ username }),
    };
  }

  async register(createDto: RegisterUsersDto): Promise<any> {
    const createUsers = new Users();
    createUsers.name = createDto.name;
    createUsers.email = createDto.email;
    createUsers.username = createDto.username;
    createUsers.password = await bcrypt.hash(createDto.password, 10);

    const user = await this.userService.createUser(createUsers);

    return {
      token: this.jwtService.sign({ username: user.username }),
    };
  }
}
