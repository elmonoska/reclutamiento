import { createContext, useContext } from "react";
import type { TCandidateProfileContext } from "../types/candidate-profile-context.type";

export const CandidateProfileContext = createContext<TCandidateProfileContext | undefined>(undefined);

export function useCandidateProfile() {
    const ctx = useContext(CandidateProfileContext);
    if (!ctx) throw new Error("useCandidateProfile debe usarse dentro de CandidateLayout");
    return ctx;
}
