import type { TApplicationStatus } from "../types/job-application.type";

export const APPLICATION_STATUS = {
    APPLIED: 'applied',
    IN_REVIEW: 'in_review',
    INTERVIEW: 'interview',
    REJECTED: 'rejected',
    HIRED: 'hired',
} as const;

export const APPLICATION_STATUS_LABELS: Record<TApplicationStatus, string> = {
    applied: 'Postulado',
    in_review: 'En revisión',
    interview: 'Entrevista',
    rejected: 'Rechazado',
    hired: 'Contratado',
};

export const APPLICATION_STATUS_STYLES: Record<TApplicationStatus, string> = {
    applied: 'bg-blue-50 text-blue-700 border-blue-100',
    in_review: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    interview: 'bg-purple-50 text-purple-700 border-purple-100',
    rejected: 'bg-red-50 text-red-700 border-red-100',
    hired: 'bg-green-50 text-green-700 border-green-100',
};

export const MANUAL_APPLICATION_STATUS_OPTIONS: { value: TApplicationStatus; label: string }[] = [
    { value: APPLICATION_STATUS.IN_REVIEW, label: APPLICATION_STATUS_LABELS.in_review },
    { value: APPLICATION_STATUS.INTERVIEW, label: APPLICATION_STATUS_LABELS.interview },
    { value: APPLICATION_STATUS.REJECTED, label: APPLICATION_STATUS_LABELS.rejected },
    { value: APPLICATION_STATUS.HIRED, label: APPLICATION_STATUS_LABELS.hired },
];

export const FINAL_APPLICATION_STATUSES: TApplicationStatus[] = [
    APPLICATION_STATUS.REJECTED,
    APPLICATION_STATUS.HIRED,
];
