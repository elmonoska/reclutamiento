import {Request, Response} from 'express';
import { TRequestWithUser } from '../types/auth';
import Logger from '../utils/logger.utils';
import { normalizeError, sendError, sendSuccess } from '../helpers/response.helper';
import CatState from '../models/catalogs/cat-state.model';
import CatCategoryJob from '../models/catalogs/cat-category-job.model';
import CatEmploymentType from '../models/catalogs/cat-employment-type.model';
import CatExperienceLevel from '../models/catalogs/cat-experience-level.model';
import CatEducationLevel from '../models/catalogs/cat-education-level.model';
import CatWorkModel from '../models/catalogs/cat-work-model.model';

export default class JobPostingController {
    static async getCatalogs(req: Request, res: Response) {
        try {
            const states = await CatState.findAll();
            const jobCategories = await CatCategoryJob.findAll();
            const employmentTypes = await CatEmploymentType.findAll();
            const experienceLevels = await CatExperienceLevel.findAll();
            const educationLevels = await CatEducationLevel.findAll();
            const workModels = await CatWorkModel.findAll();

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
        console.log(req.body)
        return res.send('create')
    }
}