import { Module } from '@nestjs/common';
import { EmailServiceService } from './email-service.service';
import { ResendModule } from 'nestjs-resend';

@Module({
  providers: [EmailServiceService],
  imports: [ResendModule],
})
export class EmailServiceModule {}
