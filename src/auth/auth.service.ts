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
import { VerifyAccountDto } from './dto/verify-account.dto';
import { User } from '@prisma/client';
import { PasswordResetDto } from './dto/password-reset.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user || !user.verification_state) {
      throw new NotFoundException('user not found');
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      throw new NotFoundException('Invalid password');
    }

    return {
      token: this.usersService.generateAccountToken(user),
      user,
    };
  }

  async getUserToken(user: User): Promise<any> {
    return {
      token: this.usersService.generateAccountToken(user),
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

  async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    return this.usersService.verifyAccount(verifyAccountDto.token);
  }

  async passwordResetRequest(passwordResetRequestDto: PasswordResetRequestDto) {
    const user = await this.usersService.findByEmail(
      passwordResetRequestDto.email,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.usersService.generateAccountToken(user);

    await this.emailService.sendResetPasswordEmail(user.email, {
      userName: user.name,
      resetLink: `${this.configService.get(
        'FRONTEND_URL',
      )}/forgot-password/${token}`,
    });
  }

  async passwordReset(passwordResetDto: PasswordResetDto) {
    if (passwordResetDto.password !== passwordResetDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const jwt = this.jwtService.verify(passwordResetDto.token);

    return this.usersService.passwordReset(
      jwt.user_id,
      passwordResetDto.password,
    );
  }
}
