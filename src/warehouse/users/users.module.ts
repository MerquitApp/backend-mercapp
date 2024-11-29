import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { APP_FILTER } from '@nestjs/core';
import { GeneralExceptionFilter } from 'src/filters/exceptions/general-exception/general-exception.filter';
import { PrismaService } from 'src/prisma.service';

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
  exports: [UsersService],
})
export class UsersModule {}
