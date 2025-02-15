import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { APP_FILTER } from '@nestjs/core';
import { GeneralExceptionFilter } from 'src/filters/exceptions/general-exception/general-exception.filter';
import { PrismaService } from 'src/common/db/prisma.service';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_FILTER,
      useClass: GeneralExceptionFilter,
    },
    PrismaService,
  ],
  imports: [EmailModule, JwtModule, ConfigModule],
  exports: [UsersService],
})
export class UsersModule {}
