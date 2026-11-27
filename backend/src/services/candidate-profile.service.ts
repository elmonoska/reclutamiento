import dbConnection from "../db/config";
import CandidateProfile from "../models/candidate-profile.model";
import CandidateResume from "../models/candidate-resume.model";
import CatEducationLevel from "../models/catalogs/cat-education-level.model";
import CatExperienceLevel from "../models/catalogs/cat-experience-level.model";
import CatState from "../models/catalogs/cat-state.model";
import CatWorkModel from "../models/catalogs/cat-work-model.model";
import User from "../models/user.model";
import StorageService from "./storage.service";
import { APP_ERROR } from "../constants/errors.constants";
import type { TCandidateProfileInput, TCandidateResumeFileInput } from "../types/candidate.type";

export default class CandidateProfileService {
    static async getMyProfile(id_user: number) {
        const profile = await CandidateProfile.findOne({
            where: { id_user },
            include: [
                { model: CatState, attributes: ['id_cat_state', 'name'] },
                { model: CatEducationLevel, attributes: ['id_cat_education_level', 'name'] },
                { model: CatExperienceLevel, attributes: ['id_cat_experience_level', 'name'] },
                { model: CatWorkModel, attributes: ['id_cat_work_model', 'name'] },
            ]
        });
        const resume = await CandidateResume.findOne({ where: { id_user } });
        return { profile, resume };
    }

    static async upsertProfile(user: User, input: TCandidateProfileInput, resumeFile?: TCandidateResumeFileInput) {
        const existingProfile = await CandidateProfile.findOne({ where: { id_user: user.id_user } });
        const existingResume = await CandidateResume.findOne({ where: { id_user: user.id_user } });

        if (!existingProfile && !resumeFile) {
            throw new Error(APP_ERROR.RESUME_REQUIRED);
        }

        let uploadedPath: string | null = null;
        try {
            return await dbConnection.transaction(async (t) => {
                let profile = existingProfile;
                if (profile) {
                    await profile.update(input, { transaction: t });
                } else {
                    profile = await CandidateProfile.create({ ...input, id_user: user.id_user }, { transaction: t });
                }

                if (resumeFile) {
                    uploadedPath = await StorageService.uploadResume(resumeFile.buffer, resumeFile.mimeType, user.uuid_user);
                    const resumeData = {
                        id_user: user.id_user,
                        storage_path: uploadedPath,
                        original_name: resumeFile.originalName,
                        mime_type: resumeFile.mimeType,
                        size_bytes: resumeFile.size,
                    };
                    if (existingResume) {
                        await existingResume.update(resumeData, { transaction: t });
                    } else {
                        await CandidateResume.create(resumeData, { transaction: t });
                    }
                }

                const oldPath = resumeFile && existingResume ? existingResume.storage_path : null;
                return { profile, oldPath, uploadedPath };
            }).then(async (result) => {
                if (result.oldPath && result.uploadedPath && result.oldPath !== result.uploadedPath) {
                    try { await StorageService.deleteResume(result.oldPath); } catch { /* best effort */ }
                }
                return this.getMyProfile(user.id_user);
            });
        } catch (err) {
            if (uploadedPath) {
                try { await StorageService.deleteResume(uploadedPath); } catch { /* best effort */ }
            }
            throw err;
        }
    }

    static async getResumeUrl(id_user: number) {
        const resume = await CandidateResume.findOne({ where: { id_user } });
        if (!resume) throw new Error(APP_ERROR.RESUME_NOT_FOUND);
        const url = await StorageService.getSignedResumeUrl(resume.storage_path);
        return { url, original_name: resume.original_name };
    }
}
