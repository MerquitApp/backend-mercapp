import { Injectable } from '@nestjs/common';
import { ResendService } from 'nestjs-resend';
import { RESEND_EMAIL } from 'src/common/constants';

@Injectable()
export class EmailServiceService {
  constructor(private readonly resendService: ResendService) {}

  async sendAccoutVerificationEmail(email: string) {
    await this.resendService.send({
      from: RESEND_EMAIL,
      to: email,
      subject: 'Verifica tu cuenta',
      html: 'TODO',
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
