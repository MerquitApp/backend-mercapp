import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AUTH_COOKIE } from 'src/common/constants';
import { UsersService } from 'src/users/users.service';
import type { Request } from 'express';
import * as cookieParser from 'cookie-parser';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request): string | null => {
        let token = null;

        if (req?.signedCookies) {
          token = req.signedCookies[AUTH_COOKIE];
        }

        if (req?.headers?.authorization) {
          token = cookieParser.signedCookie(
            decodeURIComponent(req.headers.authorization.split('Bearer ')[1]),
            this.configService.get('COOKIE_SECRET'),
          );
        }

        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: { user_id: number }): Promise<any> {
    const user = await this.usersService.findById(payload.user_id);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
