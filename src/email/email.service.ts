import { Injectable } from '@nestjs/common';
import { ResendService } from 'nestjs-resend';
import { RESEND_EMAIL } from 'src/common/constants';
import { sendAccountVerificationEmailTemplate } from './email-templates/sendAccountVerification.template';

@Injectable()
export class EmailService {
  constructor(private readonly resendService: ResendService) {}

  async sendAccoutVerificationEmail(
    email: string,
    {
      userName,
      confirmationLink,
    }: { userName: string; confirmationLink: string },
  ) {
    await this.resendService.send({
      from: RESEND_EMAIL,
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
      from: RESEND_EMAIL,
      to: email,
      subject: 'Restablecer contraseña',
      html: 'TODO',
    });
  }

  async sendOrderConfirmationEmail(email: string) {
    await this.resendService.send({
      from: RESEND_EMAIL,
      to: email,
      subject: 'Confirmación de pedido',
      html: 'TODO',
    });
  }
}
