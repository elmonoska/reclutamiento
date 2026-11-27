import { Request, Response } from 'express';
import Logger from '../utils/logger.utils';
import { normalizeError, sendError, sendSuccess } from '../helpers/response.helper';
import CatalogsService from '../services/catalogs.service';
import JobPostingService from '../services/job-posting.service';
import { getPagination, getTotalPages } from '../utils/pagination.utils';
import { APP_ERROR } from '../constants/errors.constants';

export default class PublicJobPostingController {
    static async getCatalogs(_req: Request, res: Response) {
        try {
            const data = await CatalogsService.getAllCatalogs();
            return sendSuccess(res, 200, '', data);
        } catch (err) {
            Logger.error(`Ocurrio un error al obtener los catalogos publicos: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al obtener los catalogos');
        }
    }

    static async getPublishedJobPostings(req: Request, res: Response) {
        try {
            const { page, limit, offset } = getPagination(req.query, 10);
            const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
            const id_employment_type = req.query.id_employment_type ? Number(req.query.id_employment_type) : undefined;
            const id_state = req.query.id_state ? Number(req.query.id_state) : undefined;
            const id_work_model = req.query.id_work_model ? Number(req.query.id_work_model) : undefined;
            const id_job_category = req.query.id_job_category ? Number(req.query.id_job_category) : undefined;

            const jobPostings = await JobPostingService.getPublishedJobPostings(offset, limit, { search, id_employment_type, id_state, id_work_model, id_job_category });
            const totalPages = getTotalPages(jobPostings.count, limit);

            return res.status(200).json({
                count: jobPostings.count,
                totalPages,
                currentPage: page,
                limit,
                jobPostings: jobPostings.rows
            });
        } catch (err) {
            Logger.error(`Ocurrio un error al obtener vacantes publicas: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al obtener vacantes publicas');
        }
    }

    static async getPublishedJobPostingById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const jobPosting = await JobPostingService.getPublishedJobPostingById(id);
            return sendSuccess(res, 200, '', { jobPosting });
        } catch (err: any) {
            Logger.error(`Ocurrio un error al obtener la vacante publica: ${normalizeError(err)}`);
            if (err.message === APP_ERROR.NOT_FOUND) {
                return sendError(res, 404, 'Vacante no encontrada');
            }
            return sendError(res, 500, 'Ocurrio un error al obtener la vacante');
        }
    }
}
