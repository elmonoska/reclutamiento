import CatState from "../models/catalogs/cat-state.model";
import CatEmploymentType from "../models/catalogs/cat-employment-type.model";
import CatExperienceLevel from "../models/catalogs/cat-experience-level.model";
import CatEducationLevel from "../models/catalogs/cat-education-level.model";
import CatWorkModel from "../models/catalogs/cat-work-model.model";
import CatJobCategory from "../models/catalogs/cat-job-category.model";

export default class CatalogsService {
    static async getAllCatalogs() {
        const [states, jobCategories, employmentTypes, experienceLevels, educationLevels, workModels] = await Promise.all([
            CatState.findAll({ order: [['name', 'ASC']], attributes: [['id_cat_state', 'id'], 'name'] }),
            CatJobCategory.findAll({ order: [['name', 'ASC']], attributes: [['id_cat_job_category', 'id'], 'name'] }),
            CatEmploymentType.findAll({ attributes: [['id_cat_employment_type', 'id'], 'name'] }),
            CatExperienceLevel.findAll({ attributes: [['id_cat_experience_level', 'id'], 'name'] }),
            CatEducationLevel.findAll({ attributes: [['id_cat_education_level', 'id'], 'name'] }),
            CatWorkModel.findAll({ attributes: [['id_cat_work_model', 'id'], 'name'] }),
        ]);

        return {
            states,
            jobCategories,
            employmentTypes,
            experienceLevels,
            educationLevels,
            workModels
        };
    }
}
