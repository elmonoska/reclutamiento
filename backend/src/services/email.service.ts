import { FRONTEND_URL } from "../constants/index.constants";
import { sendEmail } from "../lib/mail/nodemailer";

export default class EmailService {
    static async sendAccountConfirmation(email: string, uuid: string, token: number) {
        const URL = `${FRONTEND_URL}/auth/confirmar-cuenta/${uuid}`;
        const template = `
            <h1>Confirma tu cuenta</h1>
             <p>Es necesario confirmar tu cuenta con tu token en el siguiente enlace:</p>
             <a href="${URL}" target="_blank">Confirmalo aqui</a>
             <h2>Token: <strong>${token}</strong></h2>
        `;
        await sendEmail(
            email,
            'Confirmacion de cuenta',
            undefined,
            template
        );
    }

    static async sendPasswordReset(email: string, uuid: string, token: number) {
        const URL = `${FRONTEND_URL}/auth/restablecer-contrasena/${uuid}`;
        const template = `
            <h1>Confirma tu restablecimiento de contraseña</h1>
            <p>Es necesario confirmar el restablecimiento con tu token en el siguiente enlace:</p>
            <a href="${URL}" target="_blank">Confirmalo aqui</a>
            <h2>Token: <strong>${token}</strong></h2>
        `;
        await sendEmail(
            email,
            'Confirmacion de restablecimiento de contraseña',
            undefined,
            template
        );
    }

    static async sendPasswordChange(email: string, token: number, confirmUrl: string) {
        const template = `
            <h1>Confirma el cambio de contraseña</h1>
            <p>Solicitaste cambiar la contraseña de tu cuenta. Usa este token para confirmar el cambio en el siguiente enlace:</p>
            <a href="${confirmUrl}" target="_blank">Confirmar cambio de contraseña</a>
            <h2>Token: <strong>${token}</strong></h2>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        `;
        await sendEmail(
            email,
            'Confirmacion de cambio de contraseña',
            undefined,
            template
        );
    }
}
