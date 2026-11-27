export type TCandidateProfileInput = {
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
};

export type TCandidateResumeFileInput = {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    size: number;
};
