import { Response, NextFunction } from 'express';
import { TRequestWithJobPosting } from '../types/auth';
import JobPosting from '../models/job-posting.model';
import Logger from '../utils/logger.utils';
import { normalizeError, sendError } from '../helpers/response.helper';

export async function authorizeJobPostingOwner(req: TRequestWithJobPosting, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const jobPosting = await JobPosting.findByPk(id, { paranoid: false });
        if (!jobPosting) {
            return sendError(res, 404, 'Vacante no encontrada');
        }
        if (jobPosting.created_by !== req.user!.id_user) {
            return sendError(res, 403, 'No tienes permiso para realizar esta accion');
        }
        req.jobPosting = jobPosting;
        next();
    } catch (err) {
        Logger.error(`Ocurrio un error al validar permisos de la vacante: ${normalizeError(err)}`);
        return sendError(res, 500, 'Ocurrio un error al validar permisos de la vacante');
    }
}
