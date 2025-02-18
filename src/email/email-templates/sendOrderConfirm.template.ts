import { MERCAPP_LOGO_URL } from '../constants';

export interface OrderConfirmationEmailTemplate {
  userName: string;
  orderNumber: string;
  orderDate: string;
  orderTotal: number;
  orderLink: string;
}

export const sendOrderConfirmEmailTemplate = ({
  userName,
  orderNumber,
  orderDate,
  orderTotal,
  orderLink,
}: OrderConfirmationEmailTemplate) => `
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
            ¡Gracias por tu compra, ${userName}!
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 16px; color: #555; padding: 10px 20px;">
            Hemos recibido tu pedido. Aquí están los detalles:
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 16px; color: #333; font-weight: bold; padding: 10px 0;">
            Pedido #${orderNumber}
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 14px; color: #555;">
            Fecha: ${orderDate}
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 14px; color: #555; padding-bottom: 10px;">
            Total: <strong>${orderTotal}€</strong>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px;">
            <a href="${orderLink}" style="background-color: #517663; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
              Ver Pedido
            </a>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 14px; color: #777; padding: 10px 20px;">
            Si tienes alguna pregunta, contáctanos a soporte@mercapp.com.
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
