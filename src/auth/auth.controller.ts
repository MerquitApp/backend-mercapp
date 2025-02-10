import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { Response } from 'express';
import { RegisterUsersDto } from './dto/register-user.dto';
import { AUTH_COOKIE, AUTH_COOKIE_EXPIRATION } from 'src/common/constants';
import { JwtAuthGuard } from './auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(
    @Res() response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    try {
      const result = await this.authService.login(loginDto);
      response.cookie(AUTH_COOKIE, result.token, {
        httpOnly: true,
        secure: true,
        signed: true,
        sameSite: 'none',
        expires: new Date(Date.now() + AUTH_COOKIE_EXPIRATION),
      });

      return response.status(200).json({
        status: 'Success!',
      });
    } catch (err) {
      return response.status(500).json({
        status: 'Error!',
        message: 'Internal Server Error!',
      });
    }
  }
  @Post('/register')
  async register(
    @Res() response: Response,
    @Body() registerDto: RegisterUsersDto,
  ): Promise<any> {
    try {
      const result = await this.authService.register(registerDto);
      return response.status(HttpStatus.OK).json({
        status: 'Ok!',
        message: 'Successfully register user!',
        result: result,
      });
    } catch (err) {
      console.log(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'Error!',
        message: 'Internal Server Error!',
      });
    }
  }

  @Post('/logout')
  async logout(@Res() response: Response) {
    response.clearCookie(AUTH_COOKIE);
    return response.status(200).json({
      status: 'Success!',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verify')
  async verify(@Req() request) {
    return request.user;
  }
}
