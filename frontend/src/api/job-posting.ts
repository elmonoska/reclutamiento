import api from "../lib/axios";
import type { TApiResponse, TApiResponseCatalogs, TApiResponseJobApplicationDetail, TApiResponseJobApplications, TApiResponseJobPosting, TApiResponseJobPostings, TApiResponseLastJobPostings, TApiResponseResumeUrl, TJobPostingFilters, TPublicJobPostingFilters } from "../types/api.type";
import type { TEditJobPostingForm, TJobPostingForm } from "../types/form.type";
import { apiErrorHandler } from "../utils/apiErrorHandler";

const PREFIX = 'job-postings';

export async function getCatalogs(): Promise<TApiResponse<TApiResponseCatalogs>> {
    try {
        const { data } = await api.get(`/${PREFIX}/catalogs`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}

export async function createJobPosting(dataForm: TJobPostingForm): Promise<TApiResponse> {
    try {
        const { data } = await api.post(`/${PREFIX}`, dataForm);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}

export async function getLastJobPostings(): Promise<TApiResponse<TApiResponseLastJobPostings>> {
    try {
        const { data } = await api.get(`/${PREFIX}/recent`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}

export async function getJobPostingById(id: string): Promise<TApiResponse<TApiResponseJobPosting>> {
    try {
        const { data } = await api.get(`/${PREFIX}/${id}`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}

export async function editJobPosting(id: string, dataForm: TEditJobPostingForm): Promise<TApiResponse> {
    try {
        const { data } = await api.put(`/${PREFIX}/${id}`, dataForm);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}

export async function getJobPostings(page = 1, limit = 10, filters: TJobPostingFilters = {}): Promise<TApiResponse<TApiResponseJobPostings>> {
    try {
        const params: Record<string, string | number> = { page, limit };
        if (filters.search) params.search = filters.search;
        if (filters.status) params.status = filters.status;
        const { data } = await api.get(`/${PREFIX}`, { params });
        return { success: true, message: '', data };
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}

export async function deleteJobPosting(id: number): Promise<TApiResponse> {
    try {
        const { data } = await api.delete(`/${PREFIX}/${id}`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}

export async function getPublicJobPostings(page = 1, filters: TPublicJobPostingFilters = {}): Promise<TApiResponse<TApiResponseJobPostings>> {
    try {
        const params: Record<string, string | number> = { page };
        if (filters.search) params.search = filters.search;
        if (filters.id_employment_type) params.id_employment_type = filters.id_employment_type;
        if (filters.id_state) params.id_state = filters.id_state;
        if (filters.id_work_model) params.id_work_model = filters.id_work_model;
        if (filters.id_job_category) params.id_job_category = filters.id_job_category;
        const { data } = await api.get(`/public/${PREFIX}`, { params });
        return { success: true, message: '', data };
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}

export async function getPublicCatalogs(): Promise<TApiResponse<TApiResponseCatalogs>> {
    try {
        const { data } = await api.get(`/public/${PREFIX}/catalogs`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err)};
    }
}

export async function getJobApplications(id_job_posting: number, page = 1, limit = 10): Promise<TApiResponse<TApiResponseJobApplications>> {
    try {
        const { data } = await api.get(`/${PREFIX}/${id_job_posting}/applications`, { params: { page, limit } });
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}

export async function getJobApplicationDetail(id_job_posting: number, applicationId: number): Promise<TApiResponse<TApiResponseJobApplicationDetail>> {
    try {
        const { data } = await api.get(`/${PREFIX}/${id_job_posting}/applications/${applicationId}`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}

export async function getJobApplicationResumeUrl(id_job_posting: number, applicationId: number): Promise<TApiResponse<TApiResponseResumeUrl>> {
    try {
        const { data } = await api.get(`/${PREFIX}/${id_job_posting}/applications/${applicationId}/resume-url`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}

export async function updateJobApplicationStatus(id_job_posting: number, applicationId: number, status: string): Promise<TApiResponse<TApiResponseJobApplicationDetail>> {
    try {
        const { data } = await api.patch(`/${PREFIX}/${id_job_posting}/applications/${applicationId}/status`, { status });
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}
