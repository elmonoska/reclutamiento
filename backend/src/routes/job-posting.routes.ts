import { Router } from "express";
import JobPostingController from "../controllers/job-posting.controller";
import JobApplicationController from "../controllers/job-application.controller";
import { requireRole, validateCookieToken } from "../middlewares/auth.middleware";
import { handleInputErrors } from "../middlewares/index.middleware";
import { authorizeJobPostingOwner } from "../middlewares/job-posting.middleware";
import { body, param } from "express-validator";
import sanitize from "sanitize-html";
import { USER_ROLES } from "../constants/auth.constants";
import { MANUAL_APPLICATION_STATUSES } from "../constants/job-application.constants";

const jobPostingRouter: Router = Router();

jobPostingRouter.use(validateCookieToken, requireRole(USER_ROLES.RECRUITER, USER_ROLES.ADMIN));

jobPostingRouter.get(
    '/catalogs',
    JobPostingController.getCatalogs
);

jobPostingRouter.post(
    '/',
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
    '/recent',
    JobPostingController.lastJobPostings
);

jobPostingRouter.get(
    '/:id',
    param('id').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    handleInputErrors,
    JobPostingController.getJobPostingById
);

jobPostingRouter.put(
    '/:id',
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

jobPostingRouter.get(
    '/:id/applications',
    param('id').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    handleInputErrors,
    authorizeJobPostingOwner,
    JobApplicationController.getJobApplications
);

jobPostingRouter.get(
    '/:id/applications/:applicationId',
    param('id').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    param('applicationId').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    handleInputErrors,
    authorizeJobPostingOwner,
    JobApplicationController.getJobApplicationDetail
);

jobPostingRouter.get(
    '/:id/applications/:applicationId/resume-url',
    param('id').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    param('applicationId').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    handleInputErrors,
    authorizeJobPostingOwner,
    JobApplicationController.getApplicationResumeUrl
);

jobPostingRouter.patch(
    '/:id/applications/:applicationId/status',
    param('id').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    param('applicationId').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    body('status').isIn(MANUAL_APPLICATION_STATUSES).withMessage('Estatus invalido'),
    handleInputErrors,
    authorizeJobPostingOwner,
    JobApplicationController.updateStatus
);

jobPostingRouter.delete(
    '/:id',
    param('id').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    handleInputErrors,
    authorizeJobPostingOwner,
    JobPostingController.deleteJobPosting
);

export default jobPostingRouter;
