import api from "../lib/axios";
import type { TApiResponse, TApiResponseCatalogs } from "../types/api.type";
import type { TJobPostingForm } from "../types/form.type";
import { apiErrorHandler } from "../utils/apiErrorHandler";

const PREFIX = '/job-posting';

export async function getCatalogs(): Promise<TApiResponse<TApiResponseCatalogs>> {
    try {
        const { data } = await api.get(`${PREFIX}/catalogs`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}

export async function createJobPosting(dataForm: TJobPostingForm): Promise<TApiResponse> {
    try {
        const { data } = await api.post(`${PREFIX}/create`, dataForm);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}
