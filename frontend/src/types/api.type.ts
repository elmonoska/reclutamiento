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
    user: TUser;
}

// job-posting
export type TCatalog = {
    id: number;
    name: string;
}
export type TApiResponseCatalogs = {
    educationLevels: TCatalog[];
    employmentTypes: TCatalog[];
    experienceLevels: TCatalog[];
    jobCategories: TCatalog[];
    states: TCatalog[];
    workModels: TCatalog[];
}

export type TJobPosting = {
    id_job_posting: number;
    title: string;
    description: string;
    requirements: string;
    benefits: string;
    salary_min: number | null;
    salary_max: number | null;
    status: 'published' | 'closed';
    created_by: number;
    id_state: number;
    id_job_category: number;
    id_employment_type: number;
    id_experience_level: number;
    id_education_level: number;
    id_work_model: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export type TApiResponseLastJobPostings = {
    lastJobPostings: TJobPosting[];
}
export type TApiResponseJobPostings = {
    jobPostings: TJobPosting[];
}

export type TApiResponseJobPosting = {
    jobPosting: TJobPosting;
}