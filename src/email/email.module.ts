import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ResendModule } from 'nestjs-resend';

@Module({
  providers: [EmailService],
  imports: [ResendModule],
  exports: [EmailService],
})
export class EmailModule {}
