import { APP_ERROR } from "../constants/errors.constants";

export type TAppError = typeof APP_ERROR[keyof typeof APP_ERROR];
