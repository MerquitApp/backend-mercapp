import { MERCAPP_LOGO_URL } from '../constants';

export interface PasswordResetEmailTemplate {
  userName: string;
  resetLink: string;
}

export const sendPasswordResetEmailTemplate = ({
  userName,
  resetLink,
}: PasswordResetEmailTemplate) => `
<table width="100%" style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
  <tr>
    <td align="center">
      <table width="600" style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <img src="${MERCAPP_LOGO_URL}" alt="MercApp Logo" width="100" />
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 24px; color: #333; font-weight: bold;">
            Restablecer Contraseña
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 16px; color: #555; padding: 10px 20px;">
            Hola ${userName}, hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar.
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px;">
            <a href="${resetLink}" style="background-color: #517663; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
              Restablecer Contraseña
            </a>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 14px; color: #777; padding: 10px 20px;">
            Si no solicitaste este cambio, puedes ignorar este correo.
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0; font-size: 12px; color: #999;">
            &copy; 2025 MercApp. Todos los derechos reservados.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
