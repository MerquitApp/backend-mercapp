import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, UsersService],
  imports: [UsersModule, PassportModule],
})
export class AuthModule {}
