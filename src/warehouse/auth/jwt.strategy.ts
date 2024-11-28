import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrkey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { user_id: number }) {
    const users = await this.prismaService.user.findUnique({
      where: {
        user_id: payload.user_id,
      },
    });
    return users;
  }
}
