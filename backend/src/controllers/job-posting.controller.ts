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
import JobPosting from '../models/job-posting.model';

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
            await JobPosting.create({...req.body, created_by: req.user!.id_user});
            return sendSuccess(res, 201, 'Vacante creada exitosamente');
        } catch (err) {
            Logger.error(`Ocurrio un error al crear la vacante: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al crear la vacante');
        }

    }
}