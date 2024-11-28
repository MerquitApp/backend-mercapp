import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { Request, Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() LoginDto: LoginDto,
  ): Promise<any> {
    try {
      const result = await this.authService.login(LoginDto);
      return response.status(200).json({
        status: 'Ok!',
        message: 'Login correcto!',
        result: result,
      });
    } catch (err) {
      return response.status(500).json({
        status: 'Error!',
        message: 'Error interno de servidor!',
      });
    }
  }
}
