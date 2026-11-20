import api from "../lib/axios";
import type { TApiResponse, TApiResponseCatalogs, TApiResponseJobPosting, TApiResponseLastJobPostings } from "../types/api.type";
import type { TEditJobPostingForm, TJobPostingForm } from "../types/form.type";
import { apiErrorHandler } from "../utils/apiErrorHandler";

const PREFIX = '/job-postings';

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

export async function getLastJobPostings(): Promise<TApiResponse<TApiResponseLastJobPostings>> {
    try {
        const { data } = await api.get(`${PREFIX}/last-job-postings`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}

export async function getJobPostingById(id: string): Promise<TApiResponse<TApiResponseJobPosting>> {
    try {
        const { data } = await api.get(`${PREFIX}/${id}`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}

export async function editJobPosting(id: string, dataForm: TEditJobPostingForm): Promise<TApiResponse> {
    try {
        console.log(dataForm)
        const { data } = await api.put(`${PREFIX}/${id}`, dataForm);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}
