import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';

interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

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

  @Get('profile')
  @Auth(Role.USER)
  profile(@ActiveUser() user: UserActiveInterface) {
    console.log(user);
    return this.authService.profile(user);
  }
}
