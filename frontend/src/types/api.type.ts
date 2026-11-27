import type { TUser } from "./auth.type";
import type { TApplicationStatus } from "./job-application.type";

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
    id_job_category: number;
    id_employment_type: number;
    id_experience_level: number;
    id_education_level: number;
    id_work_model: number;
    id_state: number;
    status: 'published' | 'closed';
    created_by: number;
    createdBy?: { id_user: number; name: string };
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    deleted_at?: string | null;
    applications_count?: number | string;
}

export type TApiResponseLastJobPostings = {
    lastJobPostings: TJobPosting[];
}
export type TApiResponseJobPostings = {
    count: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    jobPostings: TJobPosting[];
}

export type TApiResponseJobPosting = {
    jobPosting: TJobPosting;
}

export type TJobPostingFilters = {
    search?: string;
    status?: string;
}

export type TPublicJobPostingFilters = {
    search?: string;
    id_employment_type?: number | '';
    id_state?: number | '';
    id_work_model?: number | '';
    id_job_category?: number | '';
}

export type TCandidateProfile = {
    id_candidate_profile: number;
    id_user: number;
    phone: string;
    headline: string;
    summary: string;
    id_state: number;
    id_education_level: number;
    id_experience_level: number;
    id_work_model: number;
    expected_salary: number | null;
    linkedin_url: string | null;
    github_url: string | null;
    portfolio_url: string | null;
    createdAt: string;
    updatedAt: string;
    state?: { id_cat_state: number; name: string };
    educationLevel?: { id_cat_education_level: number; name: string };
    experienceLevel?: { id_cat_experience_level: number; name: string };
    workModel?: { id_cat_work_model: number; name: string };
}

export type TCandidateResume = {
    id_candidate_resume: number;
    id_user: number;
    storage_path: string;
    original_name: string;
    mime_type: string;
    size_bytes: number | null;
    createdAt: string;
    updatedAt: string;
}

export type TApiResponseCandidateProfile = {
    profile: TCandidateProfile | null;
    resume: TCandidateResume | null;
    profileComplete: boolean;
}

export type TApiResponseResumeUrl = {
    url: string;
    applicationStatus?: TApplicationStatus;
}

export type TJobApplication = {
    id_job_application: number;
    uuid_job_application: string;
    id_user: number;
    id_job_posting: number;
    id_cat_application_status: number;
    resume_snapshot_path: string | null;
    cover_letter: string | null;
    createdAt: string;
    updatedAt: string;
    applicationStatus?: { id_cat_application_status: number; name: string };
}

export type TApiResponseJobApplication = {
    application: TJobApplication | null;
}

export type TCandidateJobApplication = TJobApplication & {
    jobPosting?: {
        id_job_posting: number;
        title: string;
        salary_min: number | null;
        salary_max: number | null;
        id_state: number;
        id_work_model: number;
        status: 'published' | 'closed';
        state?: { id_cat_state: number; name: string };
        workModel?: { id_cat_work_model: number; name: string };
    };
}

export type TApiResponseMyApplications = {
    count: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    applications: TCandidateJobApplication[];
}

export type TJobApplicationCandidate = {
    id_user: number;
    name: string;
    email: string;
    candidateProfile?: {
        headline: string;
        phone: string;
    } | null;
}

export type TJobApplicationWithCandidate = TJobApplication & {
    user?: TJobApplicationCandidate;
}

export type TApiResponseJobApplications = {
    jobPosting: { id_job_posting: number; title: string };
    count: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    applications: TJobApplicationWithCandidate[];
}

export type TJobApplicationDetail = TJobApplication & {
    jobPosting?: { id_job_posting: number; title: string };
    user?: {
        id_user: number;
        name: string;
        email: string;
        candidateProfile?: TCandidateProfile | null;
    };
}

export type TApiResponseJobApplicationDetail = {
    application: TJobApplicationDetail;
}
