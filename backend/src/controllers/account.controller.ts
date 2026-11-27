import { Response } from 'express';
import { sendError, sendSuccess, normalizeError } from '../helpers/response.helper';
import { TRequestWithUser } from '../types/auth.type';
import Logger from '../utils/logger.utils';
import AccountService from '../services/account.service';
import { APP_ERROR } from '../constants/errors.constants';

export default class AccountController {
    static async updateAccount(req: TRequestWithUser, res: Response) {
        try {
            const { name, email } = req.body;
            const user = await AccountService.updateAccount(req.user!.id_user, { name, email });
            return sendSuccess(res, 200, 'Datos de cuenta actualizados', {
                user: {
                    id_user: user.id_user,
                    uuid_user: user.uuid_user,
                    name: user.name,
                    email: user.email,
                    confirmed: user.confirmed,
                    id_role: user.id_role,
                    role: req.user!.role ? { id_role: req.user!.role.id_role, name: req.user!.role.name } : null,
                    createdAt: (user as any).createdAt,
                    updatedAt: (user as any).updatedAt,
                }
            });
        } catch (err: any) {
            Logger.error(`Error al actualizar cuenta: ${normalizeError(err)}`);
            if (err.message === APP_ERROR.EMAIL_ALREADY_IN_USE) return sendError(res, 409, 'El correo ya está en uso');
            return sendError(res, 500, 'Ocurrio un error al actualizar la cuenta');
        }
    }

    static async requestPasswordChange(req: TRequestWithUser, res: Response) {
        try {
            const { current_password } = req.body;
            await AccountService.requestPasswordChange(req.user!.id_user, current_password);
            return sendSuccess(res, 200, 'Te enviamos un token para confirmar el cambio de contraseña');
        } catch (err: any) {
            Logger.error(`Error al solicitar cambio de contraseña: ${normalizeError(err)}`);
            if (err.message === APP_ERROR.INVALID_CREDENTIALS) return sendError(res, 401, 'La contraseña actual es incorrecta');
            return sendError(res, 500, 'Ocurrio un error al solicitar el cambio de contraseña');
        }
    }

    static async confirmPasswordChange(req: TRequestWithUser, res: Response) {
        try {
            const { token, password } = req.body;
            await AccountService.confirmPasswordChange(req.user!.uuid_user, Number(token), password);
            return sendSuccess(res, 200, 'Contraseña actualizada exitosamente');
        } catch (err: any) {
            Logger.error(`Error al confirmar cambio de contraseña: ${normalizeError(err)}`);
            if (err.message === APP_ERROR.INVALID_TOKEN) return sendError(res, 400, 'Token inválido o expirado');
            return sendError(res, 500, 'Ocurrio un error al cambiar la contraseña');
        }
    }
}
