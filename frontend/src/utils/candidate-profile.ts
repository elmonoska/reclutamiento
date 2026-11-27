import type { TCandidateProfileForm } from "../types/form.type";

export function buildCandidateProfileFormData(values: TCandidateProfileForm, file?: File) {
    const fd = new FormData();
    fd.append('phone', values.phone);
    fd.append('headline', values.headline);
    fd.append('summary', values.summary);
    fd.append('id_state', String(values.id_state));
    fd.append('id_education_level', String(values.id_education_level));
    fd.append('id_experience_level', String(values.id_experience_level));
    fd.append('id_work_model', String(values.id_work_model));
    if (values.expected_salary !== '') fd.append('expected_salary', String(values.expected_salary));
    if (values.linkedin_url) fd.append('linkedin_url', values.linkedin_url);
    if (values.github_url) fd.append('github_url', values.github_url);
    if (values.portfolio_url) fd.append('portfolio_url', values.portfolio_url);
    if (file) fd.append('resume', file);
    return fd;
}
