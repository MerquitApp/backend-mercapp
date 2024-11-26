import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// @Module({
//   controllers: [AuthController],
//   providers: [AuthService, PrismaService, JwtStrategy, UsersService],
//   import: [
//     UsersModule,
//     PassportModule,
//     JwtModule.register({
//       secret: process.env.JWT_SECRET,
//       signOptions: {
//         expiresIn: process.env.EXPIRES_IN
//       }
//     })
//   ]
// })
// export class AuthModule()
