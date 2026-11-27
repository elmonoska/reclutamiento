import { NextFunction, Request, Response, Router } from 'express';
import { body, param, query } from 'express-validator';
import { requireRole, validateCookieToken } from '../middlewares/auth.middleware';
import { handleInputErrors } from '../middlewares/index.middleware';
import { uploadResume } from '../middlewares/upload.middleware';
import { USER_ROLES } from '../constants/auth.constants';
import CandidateProfileController from '../controllers/candidate-profile.controller';
import JobApplicationController from '../controllers/job-application.controller';
import { sendError } from '../helpers/response.helper';
import { APP_ERROR } from '../constants/errors.constants';

const candidateRouter = Router();

candidateRouter.use(validateCookieToken, requireRole(USER_ROLES.CANDIDATE));

candidateRouter.get('/profile', CandidateProfileController.getMyProfile);
candidateRouter.get('/profile/resume-url', CandidateProfileController.getMyResumeUrl);

candidateRouter.get('/applications', JobApplicationController.getMyApplications);

candidateRouter.post(
    '/applications',
    body('id_job_posting').isInt({ min: 1 }).withMessage('Id de vacante inválido'),
    handleInputErrors,
    JobApplicationController.apply
);

candidateRouter.get(
    '/applications/by-job',
    query('job_posting_id').isInt({ min: 1 }).withMessage('Id de vacante inválido').toInt(),
    handleInputErrors,
    JobApplicationController.getMyApplicationByJob
);

const optionalUrl = (field: string) =>
    body(field).optional({ values: 'falsy' }).isURL().withMessage(`${field} debe ser una URL válida`);

candidateRouter.put(
    '/profile',
    (req: Request, res: Response, next: NextFunction) => {
        uploadResume(req, res, (err: any) => {
            if (!err) return next();
            if (err.code === 'LIMIT_FILE_SIZE') return sendError(res, 400, 'El CV no debe superar 1MB');
            if (err.message === APP_ERROR.INVALID_FILE_TYPE) return sendError(res, 400, 'Solo se permiten archivos PDF');
            return sendError(res, 400, 'Error al subir el archivo');
        });
    },
    body('phone').notEmpty().withMessage('El teléfono es obligatorio'),
    body('headline').notEmpty().withMessage('El título profesional es obligatorio'),
    body('summary').notEmpty().withMessage('El resumen profesional es obligatorio'),
    body('id_state').isInt({ min: 1 }).withMessage('El estado es obligatorio'),
    body('id_education_level').isInt({ min: 1 }).withMessage('El nivel educativo es obligatorio'),
    body('id_experience_level').isInt({ min: 1 }).withMessage('El nivel de experiencia es obligatorio'),
    body('id_work_model').isInt({ min: 1 }).withMessage('La modalidad de trabajo es obligatoria'),
    body('expected_salary').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('El salario esperado debe ser un número válido'),
    optionalUrl('linkedin_url'),
    optionalUrl('github_url'),
    optionalUrl('portfolio_url'),
    handleInputErrors,
    CandidateProfileController.upsertMyProfile
);

export default candidateRouter;
