import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AUTH_COOKIE } from 'src/common/constants';
import { PrismaService } from 'src/common/db/prisma.service';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request): string | null => {
        let token = null;
        if (req?.signedCookies) {
          token = req.signedCookies[AUTH_COOKIE];
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: { user_id: number }): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        user_id: payload.user_id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
