import Role from "../models/role.model";
import { APP_ERROR } from "../constants/errors.constants";
import type { TUserRoleName } from "../types/auth.type";

export default class RoleService {
    static async getRoleByName(name: TUserRoleName) {
        const role = await Role.findOne({ where: { name } });
        if (!role) throw new Error(APP_ERROR.ROLE_NOT_FOUND);
        return role;
    }
}
