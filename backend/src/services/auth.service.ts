import AuthToken from "../models/auth-token.model";
import Role from "../models/role.model";
import User from "../models/user.model";
import { checkPassword, hashPassword } from "../utils/auth/bcrypt.utils";
import { generateJWT } from "../utils/auth/jwt.utils";
import AuthTokenService from "./auth-token.service";
import RoleService from "./role.service";
import { USER_ROLES } from "../constants/auth.constants";
import type { TUserRoleName } from "../types/auth.type";
import { APP_ERROR } from "../constants/errors.constants";

export default class AuthService {
    static async createUser(name: User['name'], email: User['email'], password: User['password'], roleName: TUserRoleName = USER_ROLES.RECRUITER) {
        const hashedPassword = await hashPassword(password);
        const role = await RoleService.getRoleByName(roleName);
        const user = await User.create({name, email, password: hashedPassword, id_role: role.id_role});
        await AuthTokenService.generateAndSendToken(user, 'confirmation');
        return user;
    }

    static async authenticate(password: User['password'], user: User) {
        if (!user.confirmed) {
            await AuthTokenService.generateAndSendToken(user, 'confirmation');
            throw new Error(APP_ERROR.UNCONFIRMED_ACCOUNT);
        }

        const isValidPassword = await checkPassword(password, user.password);
        if (!isValidPassword) {
            throw new Error(APP_ERROR.INVALID_CREDENTIALS);
        }

        const role = user.id_role ? await Role.findByPk(user.id_role) : null;
        return await generateJWT({ uuid_user: user.uuid_user, id_role: user.id_role, role: role?.name });
    }

    static async requestPasswordReset(email: User['email']) {
        const message = 'Si el correo esta registrado, recibiras un correo con las instrucciones para restablecer tu contraseña';
        const user = await User.findOne({where: {email}});

        if (!user) return;

        if (!user.confirmed) {
            // envio de email de confirmacion de cuenta
            await AuthTokenService.generateAndSendToken(user, 'confirmation');
        } else {
            // envio de email de restablecimiento de contraseña
            await AuthTokenService.generateAndSendToken(user, 'reset');
        }
    }

    static async resetUserPassword(password: User['password'], user: User, authToken: AuthToken) {
        await authToken.destroy();
        user.password = await hashPassword(password);
        await user.save();
    }
}
