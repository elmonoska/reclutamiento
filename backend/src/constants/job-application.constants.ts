import type { TApplicationStatus } from "../types/job-application.type";

export const APPLICATION_STATUS = {
    APPLIED: 'applied',
    IN_REVIEW: 'in_review',
    INTERVIEW: 'interview',
    REJECTED: 'rejected',
    HIRED: 'hired',
} as const;

export const MANUAL_APPLICATION_STATUSES: TApplicationStatus[] = [
    APPLICATION_STATUS.IN_REVIEW,
    APPLICATION_STATUS.INTERVIEW,
    APPLICATION_STATUS.REJECTED,
    APPLICATION_STATUS.HIRED,
];

export const FINAL_APPLICATION_STATUSES: TApplicationStatus[] = [
    APPLICATION_STATUS.REJECTED,
    APPLICATION_STATUS.HIRED,
];
