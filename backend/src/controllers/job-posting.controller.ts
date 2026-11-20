import {Request, Response} from 'express';
import { TRequestWithUser } from '../types/auth';
import Logger from '../utils/logger.utils';
import { normalizeError, sendError, sendSuccess } from '../helpers/response.helper';
import CatState from '../models/catalogs/cat-state.model';
import CatEmploymentType from '../models/catalogs/cat-employment-type.model';
import CatExperienceLevel from '../models/catalogs/cat-experience-level.model';
import CatEducationLevel from '../models/catalogs/cat-education-level.model';
import CatWorkModel from '../models/catalogs/cat-work-model.model';
import CatJobCategory from '../models/catalogs/cat-job-category.model';
import JobPostingService from '../services/job-posting.service';

export default class JobPostingController {
    static async getCatalogs(req: Request, res: Response) {
        try {
            const states = await CatState.findAll({order: [['name', 'ASC']], attributes: [['id_cat_state', 'id'], 'name']});
            const jobCategories = await CatJobCategory.findAll({order: [['name', 'ASC']], attributes: [['id_cat_job_category', 'id'], 'name']});
            const employmentTypes = await CatEmploymentType.findAll({attributes: [['id_cat_employment_type', 'id'], 'name']});
            const experienceLevels = await CatExperienceLevel.findAll({attributes: [['id_cat_experience_level', 'id'], 'name']});
            const educationLevels = await CatEducationLevel.findAll({attributes: [['id_cat_education_level', 'id'], 'name']});
            const workModels = await CatWorkModel.findAll({attributes: [['id_cat_work_model', 'id'], 'name']});

            const data = {
                states,
                jobCategories,
                employmentTypes,
                experienceLevels,
                educationLevels,
                workModels
            }
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
            const id = req.params.id;
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

    static async editJobPostingById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (req.body.salary_min === '') req.body.salary_min = null;
            if (req.body.salary_max === '') req.body.salary_max = null;
            await JobPostingService.editJobPostingById(id, req.body);

            return sendSuccess(res, 200, 'Vacante actualizada exitosamente');
        } catch (err: any) {
            Logger.error(`Ocurrio un error al editar informacion de la vacante: ${normalizeError(err)}`);
            if (err.message === 'NOT_FOUND') {
                return sendError(res, 404, 'Vacante no encontrada');
            }
            return sendError(res, 500, 'Ocurrio un error al editar informacion de la vacante');
        }
    }

    static async getAllJobPostings(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;
            console.log(page)
            console.log(limit)
            console.log(offset)

            const jobPostings = await JobPostingService.getJobPostings(offset, limit);

            const data = {
                count: jobPostings.count,
                jobPostings: jobPostings.rows
            }
            return res.status(200).json(data)
        } catch (err) {
            Logger.error(`Ocurrio un error al obtener informacion de las vacantes: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al obtener informacion de las vacantes');
        }
    }
}