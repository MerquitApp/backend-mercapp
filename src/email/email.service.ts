import { Injectable } from '@nestjs/common';
import { ResendService } from 'nestjs-resend';
import { sendAccountVerificationEmailTemplate } from './email-templates/sendAccountVerification.template';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly resendService: ResendService,
    private readonly configService: ConfigService,
  ) {}

  private readonly RESEND_EMAIL = this.configService.get('RESEND_EMAIL');

  async sendAccoutVerificationEmail(
    email: string,
    {
      userName,
      confirmationLink,
    }: { userName: string; confirmationLink: string },
  ) {
    await this.resendService.send({
      from: this.RESEND_EMAIL,
      to: email,
      subject: 'Verifica tu cuenta',
      html: sendAccountVerificationEmailTemplate({
        userName,
        confirmationLink,
      }),
    });
  }

  async sendResetPasswordEmail(email: string) {
    await this.resendService.send({
      from: this.RESEND_EMAIL,
      to: email,
      subject: 'Restablecer contraseña',
      html: 'TODO',
    });
  }

  async sendOrderConfirmationEmail(email: string) {
    await this.resendService.send({
      from: this.RESEND_EMAIL,
      to: email,
      subject: 'Confirmación de pedido',
      html: 'TODO',
    });
  }
}
