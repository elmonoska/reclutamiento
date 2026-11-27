import { Router } from 'express';
import { body } from 'express-validator';
import AccountController from '../controllers/account.controller';
import { validateCookieToken } from '../middlewares/auth.middleware';
import { handleInputErrors } from '../middlewares/index.middleware';

const accountRouter = Router();

accountRouter.use(validateCookieToken);

accountRouter.patch(
    '/',
    body('name').optional().isString().trim().notEmpty().withMessage('El nombre es requerido'),
    body('email').optional().isEmail().withMessage('Email no valido').normalizeEmail(),
    body().custom((_, { req }) => {
        if (!req.body.name && !req.body.email) throw new Error('Debes enviar nombre o correo');
        return true;
    }),
    handleInputErrors,
    AccountController.updateAccount
);

accountRouter.post(
    '/password/request-change',
    body('current_password').notEmpty().withMessage('La contraseña actual es requerida'),
    handleInputErrors,
    AccountController.requestPasswordChange
);

accountRouter.post(
    '/password/confirm-change',
    body('token').notEmpty().withMessage('El token es requerido').matches(/^\d{6}$/).withMessage('Token no valido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    body('confirm_password').notEmpty().withMessage('La confirmación de contraseña es requerida').custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Las contraseñas no coinciden');
        return true;
    }),
    handleInputErrors,
    AccountController.confirmPasswordChange
);

export default accountRouter;
