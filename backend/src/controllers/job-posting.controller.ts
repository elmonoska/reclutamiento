import {Request, Response} from 'express';
import { TRequestWithJobPosting, TRequestWithUser } from '../types/auth';
import Logger from '../utils/logger.utils';
import { normalizeError, sendError, sendSuccess } from '../helpers/response.helper';
import CatalogsService from '../services/catalogs.service';
import JobPostingService from '../services/job-posting.service';

export default class JobPostingController {
    static async getCatalogs(_req: Request, res: Response) {
        try {
            const data = await CatalogsService.getAllCatalogs();
            return sendSuccess(res, 200, '', data);
        } catch (err) {
            Logger.error(`Ocurrio un error al obtener los catalogos: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al obtener los catalogos');
        }
    }
    
    static async create(req: TRequestWithUser, res: Response) {
        try {
            await JobPostingService.createJobPosting(req.body, req.user!.id_user);
            return sendSuccess(res, 201, 'Vacante creada exitosamente');
        } catch (err) {
            Logger.error(`Ocurrio un error al crear la vacante: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al crear la vacante');
        }

    }

    static async lastJobPostings(req: Request, res: Response) {
        try {
            const lastJobPostings = await JobPostingService.getLastJobPostings();
            return sendSuccess(res, 200, '', {lastJobPostings});
        } catch (err) {
            Logger.error(`Ocurrio un error al obtener las ultimas vacantes publicadas: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al obtener las ultimas vacantes publicadas');
        }
    }

    static async getJobPostingById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const jobPosting = await JobPostingService.getJobPostingById(id);
            
            return sendSuccess(res, 200, '', {jobPosting})
        } catch (err: any) {
            Logger.error(`Ocurrio un error al obtener informacion de la vacante: ${normalizeError(err)}`);
            if (err.message === 'NOT_FOUND') {
                return sendError(res, 404, 'Vacante no encontrada');
            }
            return sendError(res, 500, 'Ocurrio un error al obtener informacion de la vacante');
        }
    }

    static async editJobPostingById(req: TRequestWithJobPosting, res: Response) {
        try {
            if (req.body.salary_min === '') req.body.salary_min = null;
            if (req.body.salary_max === '') req.body.salary_max = null;
            await JobPostingService.editJobPostingById(req.jobPosting!, req.body);

            return sendSuccess(res, 200, 'Vacante actualizada exitosamente');
        } catch (err) {
            Logger.error(`Ocurrio un error al editar informacion de la vacante: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al editar informacion de la vacante');
        }
    }

    static async getAllJobPostings(req: Request, res: Response) {
        try {
            const page = Math.max(parseInt(req.query.page as string) || 1, 1);
            const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
            const offset = (page - 1) * limit;
            const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
            const status = typeof req.query.status === 'string' ? req.query.status : '';

            const jobPostings = await JobPostingService.getJobPostings(offset, limit, search || undefined, status || undefined);
            const totalPages = Math.max(Math.ceil(jobPostings.count / limit), 1);

            return res.status(200).json({
                count: jobPostings.count,
                totalPages,
                currentPage: page,
                limit,
                jobPostings: jobPostings.rows
            });
        } catch (err) {
            Logger.error(`Ocurrio un error al obtener informacion de las vacantes: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al obtener informacion de las vacantes');
        }
    }

    static async deleteJobPosting(req: TRequestWithJobPosting, res: Response) {
        try {
            await JobPostingService.deleteJobPostingById(req.jobPosting!);
            return sendSuccess(res, 200, 'Vacante eliminada exitosamente');
        } catch (err) {
            Logger.error(`Ocurrio un error al eliminar la vacante: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al eliminar la vacante');
        }
    }
}