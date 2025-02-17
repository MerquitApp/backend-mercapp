import { MERCAPP_LOGO_URL } from '../constants';

export interface AccountVerificationEmailTemplate {
  userName: string;
  confirmationLink: string;
}

export const sendAccountVerificationEmailTemplate = ({
  userName,
  confirmationLink,
}: AccountVerificationEmailTemplate) => `
    <table width="100%" align="center" style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
        <tr>
            <td align="center">
                <table width="600" style="background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center;">
                    <tr>
                        <td style="padding: 20px 0;">
                            <img src="${MERCAPP_LOGO_URL}" alt="MercApp Logo" width="100" style="display: block; margin: 0 auto;">
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 24px; color: #333; font-weight: bold; text-align: center;">
                            ¡Bienvenido a MercApp, ${userName}!
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; color: #555; padding: 10px 20px; text-align: center;">
                            Gracias por registrarte en MercApp. Para completar tu registro y activar tu cuenta, por favor haz clic en el botón de abajo.
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <a href="${confirmationLink}" style="background-color: #517663; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                                Confirmar Cuenta
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; color: #777; padding: 10px 20px; text-align: center;">
                            Si no solicitaste este registro, puedes ignorar este correo de forma segura.
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 0; font-size: 12px; color: #999; text-align: center;">
                            &copy; 2025 MercApp. Todos los derechos reservados.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
`;
