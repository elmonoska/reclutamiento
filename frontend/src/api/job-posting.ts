import api from "../lib/axios";
import type { TApiResponse, TApiResponseCatalogs } from "../types/api.type";
import { apiErrorHandler } from "../utils/apiErrorHandler";

export async function getCatalogs(): Promise<TApiResponse<TApiResponseCatalogs>> {
    try {
        const { data } = await api.get('/job-posting/catalogs');
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}
