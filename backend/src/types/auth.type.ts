import {Request} from 'express';
import User from '../models/user.model';
import AuthToken from '../models/auth-token.model';
import { USER_ROLES } from '../constants/auth.constants';
import JobPosting from '../models/job-posting.model';

export type TRequestWithUser = Request & {
    user?: User;
}

export type TRequestWithUserAndToken = TRequestWithUser & {
    authToken?: AuthToken;
}

export type TRequestWithJobPosting = TRequestWithUser & {
    jobPosting?: JobPosting;
}
export type TUserRoleName = typeof USER_ROLES[keyof typeof USER_ROLES];
