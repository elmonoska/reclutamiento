import User from "../models/user.model";
import AuthToken from "../models/auth-token.model";
import { generateToken } from "../utils/auth/generateCode.utils";
import { APP_ERROR } from "../constants/errors.constants";
import { FRONTEND_URL } from "../constants/index.constants";
import EmailService from "./email.service";
import { checkPassword, hashPassword } from "../utils/auth/bcrypt.utils";

export default class AccountService {
    static async updateAccount(id_user: number, data: { name?: string; email?: string }) {
        const user = await User.findByPk(id_user);
        if (!user) throw new Error(APP_ERROR.NOT_FOUND);

        if (data.name !== undefined) user.name = data.name.trim();
        if (data.email !== undefined) {
            const email = data.email.trim().toLowerCase();
            const existing = await User.findOne({ where: { email } });
            if (existing && existing.id_user !== id_user) throw new Error(APP_ERROR.EMAIL_ALREADY_IN_USE);
            user.email = email;
        }

        await user.save();
        return user;
    }

    static async requestPasswordChange(id_user: number, currentPassword: string) {
        const user = await User.scope('withPassword').findByPk(id_user);
        if (!user) throw new Error(APP_ERROR.NOT_FOUND);

        const valid = await checkPassword(currentPassword, user.password);
        if (!valid) throw new Error(APP_ERROR.INVALID_CREDENTIALS);

        await AuthToken.destroy({ where: { id_user } });
        const token = generateToken();
        await AuthToken.create({ id_user, token });
        const confirmUrl = `${FRONTEND_URL}/cuenta/cambiar-contrasena`;
        await EmailService.sendPasswordChange(user.email, token, confirmUrl);
    }

    static async confirmPasswordChange(uuid_user: string, token: number, password: string) {
        const user = await User.scope('withPassword').findOne({ where: { uuid_user } });
        if (!user) throw new Error(APP_ERROR.NOT_FOUND);

        const authToken = await AuthToken.findOne({ where: { id_user: user.id_user, token } });
        if (!authToken) throw new Error(APP_ERROR.INVALID_TOKEN);

        user.password = await hashPassword(password);
        await Promise.all([user.save(), authToken.destroy()]);
    }
}
