import type { TUser } from "./auth.type";

type SuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
}

type ErrorResponse = {
    success: false;
    message: string;
}

export type TApiResponse<T = null> = SuccessResponse<T> | ErrorResponse;

// auth
export type TApiResponseLogin = {
    token: string;
}
export type TApiResponseVerify = {
    user: TUser
}

// job-posting
export type TCatalog = {
    id: number;
    name: string;
}
export type TApiResponseCatalogs = {
    educationLevels: TCatalog[],
    employmentTypes: TCatalog[],
    experienceLevels: TCatalog[],
    jobCategories: TCatalog[],
    states: TCatalog[],
    workModels: TCatalog[],
}