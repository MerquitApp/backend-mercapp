import { Injectable } from '@nestjs/common';
import { ResendService } from 'nestjs-resend';
import {
  AccountVerificationEmailTemplate,
  sendAccountVerificationEmailTemplate,
} from './email-templates/sendAccountVerification.template';
import { ConfigService } from '@nestjs/config';
import {
  PasswordResetEmailTemplate,
  sendPasswordResetEmailTemplate,
} from './email-templates/sendPasswordReset.template';

@Injectable()
export class EmailService {
  constructor(
    private readonly resendService: ResendService,
    private readonly configService: ConfigService,
  ) {}

  private readonly RESEND_EMAIL = this.configService.get('RESEND_EMAIL');

  async sendAccoutVerificationEmail(
    email: string,
    accountVerificationEmailTemplate: AccountVerificationEmailTemplate,
  ) {
    await this.resendService.send({
      from: this.RESEND_EMAIL,
      to: email,
      subject: 'Verifica tu cuenta',
      html: sendAccountVerificationEmailTemplate(
        accountVerificationEmailTemplate,
      ),
    });
  }

  async sendResetPasswordEmail(
    email: string,
    passwordResetEmailTemplate: PasswordResetEmailTemplate,
  ) {
    await this.resendService.send({
      from: this.RESEND_EMAIL,
      to: email,
      subject: 'Restablecer contraseña',
      html: sendPasswordResetEmailTemplate(passwordResetEmailTemplate),
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
