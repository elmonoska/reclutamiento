import { APPLICATION_STATUS } from "../constants/job-application.constants";

export type TApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];
