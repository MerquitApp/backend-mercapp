import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  HttpStatus,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { Response } from 'express';
import { RegisterUsersDto } from './dto/register-user.dto';
import { AUTH_COOKIE, AUTH_COOKIE_EXPIRATION } from 'src/common/constants';
import { JwtAuthGuard } from './auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  @Post('/login')
  async login(
    @Res() response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    try {
      const result = await this.authService.login(loginDto);
      this.setAuthCookie(response, result.token);
      return response.status(200).json({
        ...result.user,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        return response.status(err.getStatus()).json({
          status: 'Error!',
          message: err.message,
        });
      }

      return response.status(500).json({
        status: 'Error!',
        message: 'Internal Server Error!',
      });
    }
  }

  @Post('/register')
  @ApiOperation({
    summary: 'Registrar usuario',
    description: 'Registra un nuevo usuario en el sistema.',
  })
  @ApiResponse({ status: 200, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
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
  @ApiOperation({
    summary: 'Cerrar sesión',
    description: 'Elimina la cookie de autenticación para cerrar la sesión.',
  })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente.' })
  async logout(@Res() response: Response) {
    response.clearCookie(AUTH_COOKIE);
    return response.status(200).json({
      status: 'Success!',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verify')
  @ApiOperation({
    summary: 'Verificar autenticación',
    description: 'Retorna los datos del usuario autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado correctamente.',
  })
  async verify(@Req() request) {
    return request.user;
  }

  @UseGuards(AuthGuard('google'))
  @Get('/google')
  async google() {
    // ...
  }

  @UseGuards(AuthGuard('google'))
  @Get('/google/callback')
  async googleCallback(@Req() req, @Res() res: Response) {
    const jwt = await this.authService.getUserToken(req.user);
    this.setAuthCookie(res, jwt.token);

    return res.redirect(this.configService.get('FRONTEND_URL'));
  }

  @UseGuards(AuthGuard('github'))
  @Get('/github')
  async github() {
    // ...
  }

  @UseGuards(AuthGuard('github'))
  @Get('/github/callback')
  async githubCallback(@Req() req, @Res() res: Response) {
    const jwt = await this.authService.getUserToken(req.user);
    this.setAuthCookie(res, jwt.token);

    return res.redirect(this.configService.get('FRONTEND_URL'));
  }

  private setAuthCookie(response: Response, token: string) {
    response.cookie(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'none',
      expires: new Date(Date.now() + AUTH_COOKIE_EXPIRATION),
    });
  }
}
