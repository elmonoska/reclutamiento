import { JOB_POSTING_STATUS, JOB_POSTING_STATUS_LABELS, JOB_POSTING_STATUS_STYLES } from "../constants/job-posting";

export function getJobPostingStatus(status?: string | null, deletedAt?: string | null) {
    if (deletedAt) return JOB_POSTING_STATUS.DELETED;
    if (status === JOB_POSTING_STATUS.PUBLISHED || status === JOB_POSTING_STATUS.CLOSED) return status;
    return JOB_POSTING_STATUS.CLOSED;
}

export function getJobPostingStatusLabel(status?: string | null, deletedAt?: string | null) {
    return JOB_POSTING_STATUS_LABELS[getJobPostingStatus(status, deletedAt)] || 'Desconocido';
}

export function getJobPostingStatusStyle(status?: string | null, deletedAt?: string | null) {
    return JOB_POSTING_STATUS_STYLES[getJobPostingStatus(status, deletedAt)] || 'bg-gray-100 text-gray-700 border-gray-200';
}
