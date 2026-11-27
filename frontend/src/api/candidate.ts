import api from "../lib/axios";
import type { TApiResponse, TApiResponseCandidateProfile, TApiResponseJobApplication, TApiResponseMyApplications, TApiResponseResumeUrl } from "../types/api.type";
import { apiErrorHandler } from "../utils/apiErrorHandler";

const PREFIX = 'candidate';

export async function getMyCandidateProfile(): Promise<TApiResponse<TApiResponseCandidateProfile>> {
    try {
        const { data } = await api.get(`/${PREFIX}/profile`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}

export async function saveCandidateProfile(formData: FormData): Promise<TApiResponse<TApiResponseCandidateProfile>> {
    try {
        const { data } = await api.put(`/${PREFIX}/profile`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}

export async function getMyResumeUrl(): Promise<TApiResponse<TApiResponseResumeUrl>> {
    try {
        const { data } = await api.get(`/${PREFIX}/profile/resume-url`);
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}

export async function applyToJob(id_job_posting: number): Promise<TApiResponse<TApiResponseJobApplication>> {
    try {
        const { data } = await api.post(`/${PREFIX}/applications`, { id_job_posting });
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}

export async function getMyApplicationByJob(id_job_posting: number): Promise<TApiResponse<TApiResponseJobApplication>> {
    try {
        const { data } = await api.get(`/${PREFIX}/applications/by-job`, { params: { job_posting_id: id_job_posting } });
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}

export async function getMyApplications(page = 1, limit = 10): Promise<TApiResponse<TApiResponseMyApplications>> {
    try {
        const { data } = await api.get(`/${PREFIX}/applications`, { params: { page, limit } });
        return data;
    } catch (err) {
        return { success: false, message: apiErrorHandler(err) };
    }
}
