import type { TJobPostingStatus } from "../types/job-posting.type";

export const JOB_POSTING_STATUS = {
    PUBLISHED: 'published',
    CLOSED: 'closed',
    DELETED: 'deleted',
} as const;

export const JOB_POSTING_STATUS_LABELS: Record<TJobPostingStatus, string> = {
    published: 'Publicada',
    closed: 'Cerrada',
    deleted: 'Eliminada',
};

export const JOB_POSTING_STATUS_STYLES: Record<TJobPostingStatus, string> = {
    published: 'bg-green-50 text-green-700 border-green-200',
    closed: 'bg-gray-100 text-gray-700 border-gray-200',
    deleted: 'bg-red-50 text-red-700 border-red-200',
};

export const JOB_POSTING_STATUS_FILTER_OPTIONS = [
    { value: JOB_POSTING_STATUS.PUBLISHED, label: 'Publicadas' },
    { value: JOB_POSTING_STATUS.CLOSED, label: 'Cerradas' },
    { value: JOB_POSTING_STATUS.DELETED, label: 'Eliminadas' },
];
