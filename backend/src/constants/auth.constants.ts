import type { TUserRoleName } from "../types/auth.type";

export const USER_ROLES = {
    ADMIN: 'admin',
    RECRUITER: 'recruiter',
    CANDIDATE: 'candidate',
} as const;

export type { TUserRoleName };
