import { JOB_POSTING_STATUS } from "../constants/job-posting.constants";

export type TJobPostingStatus = typeof JOB_POSTING_STATUS[keyof typeof JOB_POSTING_STATUS];
