import type { TApiResponseCandidateProfile } from "./api.type";

export type TCandidateProfileContext = {
    profileData: TApiResponseCandidateProfile | null;
    refreshProfile: () => Promise<void>;
};
