import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ResendModule } from 'nestjs-resend';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [EmailService],
  imports: [ResendModule, ConfigModule],
  exports: [EmailService],
})
export class EmailModule {}
