import { Response } from 'express';
import { sendError, sendSuccess, normalizeError } from '../helpers/response.helper';
import { TRequestWithUser } from '../types/auth.type';
import Logger from '../utils/logger.utils';
import CandidateProfileService from '../services/candidate-profile.service';
import { toNullableInt, toNullableString } from '../utils/parse.utils';
import { APP_ERROR } from '../constants/errors.constants';
import type { TCandidateProfileInput, TCandidateResumeFileInput } from '../types/candidate.type';

export default class CandidateProfileController {
    static async getMyProfile(req: TRequestWithUser, res: Response) {
        try {
            const data = await CandidateProfileService.getMyProfile(req.user!.id_user);
            const profileComplete = !!(data.profile && data.resume);
            return sendSuccess(res, 200, '', { ...data, profileComplete });
        } catch (err) {
            Logger.error(`Error al obtener perfil de candidato: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al obtener el perfil');
        }
    }

    static async upsertMyProfile(req: TRequestWithUser, res: Response) {
        try {
            const body = req.body;
            const input: TCandidateProfileInput = {
                phone: String(body.phone || '').trim(),
                headline: String(body.headline || '').trim(),
                summary: String(body.summary || '').trim(),
                id_state: Number(body.id_state),
                id_education_level: Number(body.id_education_level),
                id_experience_level: Number(body.id_experience_level),
                id_work_model: Number(body.id_work_model),
                expected_salary: toNullableInt(body.expected_salary),
                linkedin_url: toNullableString(body.linkedin_url),
                github_url: toNullableString(body.github_url),
                portfolio_url: toNullableString(body.portfolio_url),
            };

            const file = (req as any).file as Express.Multer.File | undefined;
            const resumeFile: TCandidateResumeFileInput | undefined = file ? {
                buffer: file.buffer,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
            } : undefined;

            const data = await CandidateProfileService.upsertProfile(req.user!, input, resumeFile);
            return sendSuccess(res, 200, 'Perfil guardado exitosamente', { ...data, profileComplete: true });
        } catch (err: any) {
            Logger.error(`Error al guardar perfil de candidato: ${normalizeError(err)}`);
            if (err.message === APP_ERROR.RESUME_REQUIRED) return sendError(res, 400, 'El CV en PDF es obligatorio');
            if (err.message === APP_ERROR.SUPABASE_NOT_CONFIGURED) return sendError(res, 500, 'El almacenamiento de archivos no está configurado');
            return sendError(res, 500, 'Ocurrio un error al guardar el perfil');
        }
    }

    static async getMyResumeUrl(req: TRequestWithUser, res: Response) {
        try {
            const data = await CandidateProfileService.getResumeUrl(req.user!.id_user);
            return sendSuccess(res, 200, '', data);
        } catch (err: any) {
            Logger.error(`Error al obtener CV: ${normalizeError(err)}`);
            if (err.message === APP_ERROR.RESUME_NOT_FOUND) return sendError(res, 404, 'No se encontró el CV');
            return sendError(res, 500, 'Ocurrio un error al obtener el CV');
        }
    }
}
