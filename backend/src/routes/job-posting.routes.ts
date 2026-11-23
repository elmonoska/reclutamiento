import { Router } from "express";
import JobPostingController from "../controllers/job-posting.controller";
import { validateCookieToken } from "../middlewares/auth.middleware";
import { handleInputErrors } from "../middlewares/index.middleware";
import { authorizeJobPostingOwner } from "../middlewares/job-posting.middleware";
import { body, param } from "express-validator";
import sanitize from "sanitize-html";

const jobPostingRouter: Router = Router();

jobPostingRouter.use(validateCookieToken);

jobPostingRouter.get(
    '/catalogs',
    JobPostingController.getCatalogs
);

jobPostingRouter.post(
    '/create',
    body('title').notEmpty().withMessage('El titulo es requerido'),
    body('description').notEmpty().withMessage('La descripcion es requerida').customSanitizer(value => sanitize(value)),
    body('requirements').notEmpty().withMessage('Los requisitos son requeridos').customSanitizer(value => sanitize(value)),
    body('benefits').notEmpty().withMessage('Los beneficios son requeridos').customSanitizer(value => sanitize(value)),
    body('salary_max').optional({values: 'null'}).isInt({min: 1}).withMessage('Salario maximo invalido').toInt(),
    body('salary_min').optional({values: 'null'}).isInt({min: 1}).withMessage('Salario maximo invalido').toInt(),
    body('id_state').notEmpty().withMessage('El estado es requerido').isInt().withMessage('Estado invalido').toInt(),
    body('id_job_category').notEmpty().withMessage('La categoria de empleo es requerido').isInt().withMessage('Categoria de empleo invalida').toInt(),
    body('id_employment_type').notEmpty().withMessage('El tipo de empleo es requerido').isInt().withMessage('Tipo de de empleo invalido').toInt(),
    body('id_experience_level').notEmpty().withMessage('El nivel de experiencia es requerido').isInt().withMessage('Nivel de experiencia invalido').toInt(),
    body('id_education_level').notEmpty().withMessage('El nivel de educacion es requerido').isInt().withMessage('Nivel de experiencia invalido').toInt(),
    body('id_work_model').notEmpty().withMessage('La modalidad de trabajo es requerida').isInt().withMessage('Modalidad de trabajo invalida').toInt(),
    handleInputErrors,
    JobPostingController.create
);

jobPostingRouter.get(
    '/last-job-postings',
    JobPostingController.lastJobPostings
);

jobPostingRouter.get(
    '/:id',
    param('id').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    handleInputErrors,
    JobPostingController.getJobPostingById
);

jobPostingRouter.put(
    '/:id/edit',
    param('id').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    handleInputErrors,
    authorizeJobPostingOwner,
    body('title').notEmpty().withMessage('El titulo es requerido'),
    body('description').notEmpty().withMessage('La descripcion es requerida').customSanitizer(value => sanitize(value)),
    body('requirements').notEmpty().withMessage('Los requisitos son requeridos').customSanitizer(value => sanitize(value)),
    body('benefits').notEmpty().withMessage('Los beneficios son requeridos').customSanitizer(value => sanitize(value)),
    body('salary_max').optional({values: 'null'}).isInt({min: 1}).withMessage('Salario maximo invalido').toInt(),
    body('salary_min').optional({values: 'null'}).isInt({min: 1}).withMessage('Salario maximo invalido').toInt(),
    body('status').notEmpty().withMessage('Estado de la vacante obligatorio'),
    body('id_state').notEmpty().withMessage('El estado es requerido').isInt().withMessage('Estado invalido').toInt(),
    body('id_job_category').notEmpty().withMessage('La categoria de empleo es requerido').isInt().withMessage('Categoria de empleo invalida').toInt(),
    body('id_employment_type').notEmpty().withMessage('El tipo de empleo es requerido').isInt().withMessage('Tipo de de empleo invalido').toInt(),
    body('id_experience_level').notEmpty().withMessage('El nivel de experiencia es requerido').isInt().withMessage('Nivel de experiencia invalido').toInt(),
    body('id_education_level').notEmpty().withMessage('El nivel de educacion es requerido').isInt().withMessage('Nivel de experiencia invalido').toInt(),
    body('id_work_model').notEmpty().withMessage('La modalidad de trabajo es requerida').isInt().withMessage('Modalidad de trabajo invalida').toInt(),
    handleInputErrors,
    JobPostingController.editJobPostingById
)

jobPostingRouter.get('/',
    JobPostingController.getAllJobPostings
);

jobPostingRouter.patch(
    '/:id/delete',
    param('id').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    handleInputErrors,
    authorizeJobPostingOwner,
    JobPostingController.deleteJobPosting
);

export default jobPostingRouter;