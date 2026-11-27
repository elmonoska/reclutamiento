import type { TJobPostingStatus } from "../types/job-posting.type";

export const JOB_POSTING_STATUS = {
    PUBLISHED: 'published',
    CLOSED: 'closed',
} as const;

export const JOB_POSTING_LIST_STATUS = {
    ...JOB_POSTING_STATUS,
    DELETED: 'deleted',
} as const;

export type { TJobPostingStatus };
