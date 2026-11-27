import api from "../lib/axios";
import type { TApiResponse } from "../types/api.type";
import type { TUser } from "../types/auth.type";
import { apiErrorHandler } from "../utils/apiErrorHandler";

const PREFIX = "account";

export async function updateAccount(data: { name?: string; email?: string }): Promise<TApiResponse<{ user: TUser }>> {
    try {
        const { data: res } = await api.patch(`/${PREFIX}`, data);
        return res;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}

export async function requestPasswordChange(current_password: string): Promise<TApiResponse> {
    try {
        const { data } = await api.post(`/${PREFIX}/password/request-change`, { current_password });
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}

export async function confirmPasswordChange(payload: { token: string; password: string; confirm_password: string }): Promise<TApiResponse> {
    try {
        const { data } = await api.post(`/${PREFIX}/password/confirm-change`, payload);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}
