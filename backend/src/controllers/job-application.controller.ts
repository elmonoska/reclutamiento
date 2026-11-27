import { Response } from "express";
import { normalizeError, sendError, sendSuccess } from "../helpers/response.helper";
import { TRequestWithUser } from "../types/auth.type";
import Logger from "../utils/logger.utils";
import JobApplicationService from "../services/job-application.service";
import StorageService from "../services/storage.service";
import { getPagination, getTotalPages } from "../utils/pagination.utils";
import { APP_ERROR } from "../constants/errors.constants";

export default class JobApplicationController {
    static async apply(req: TRequestWithUser, res: Response) {
        try {
            const id_job_posting = Number(req.body.id_job_posting);
            const application = await JobApplicationService.applyToJob(req.user!.id_user, id_job_posting);
            return sendSuccess(res, 201, 'Postulación enviada exitosamente', { application });
        } catch (err: any) {
            Logger.error(`Error al postularse a vacante: ${normalizeError(err)}`);
            if (err.message === APP_ERROR.PROFILE_INCOMPLETE) return sendError(res, 400, 'Debes completar tu perfil antes de postularte');
            if (err.message === APP_ERROR.JOB_POSTING_NOT_FOUND) return sendError(res, 404, 'La vacante no está disponible');
            if (err.message === APP_ERROR.ALREADY_APPLIED) return sendError(res, 409, 'Ya te has postulado a esta vacante');
            if (err.message === APP_ERROR.APPLICATION_STATUS_NOT_FOUND) return sendError(res, 500, 'No se encontró el estatus de postulación');
            return sendError(res, 500, 'Ocurrio un error al postularse a la vacante');
        }
    }

    static async getMyApplicationByJob(req: TRequestWithUser, res: Response) {
        try {
            const id_job_posting = Number(req.query.job_posting_id ?? req.params.id);
            const application = await JobApplicationService.getMyApplicationByJob(req.user!.id_user, id_job_posting);
            return sendSuccess(res, 200, '', { application });
        } catch (err) {
            Logger.error(`Error al obtener postulación: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al obtener la postulación');
        }
    }

    static async getMyApplications(req: TRequestWithUser, res: Response) {
        try {
            const { page, limit, offset } = getPagination(req.query);
            const applications = await JobApplicationService.getMyApplications(req.user!.id_user, offset, limit);
            const totalPages = getTotalPages(applications.count, limit);
            return res.status(200).json({
                success: true,
                message: '',
                data: {
                    count: applications.count,
                    totalPages,
                    currentPage: page,
                    limit,
                    applications: applications.rows,
                }
            });
        } catch (err) {
            Logger.error(`Error al obtener mis postulaciones: ${normalizeError(err)}`);
            return sendError(res, 500, 'Ocurrio un error al obtener las postulaciones');
        }
    }

    static async getJobApplications(req: TRequestWithUser, res: Response) {
        try {
            const id_job_posting = Number(req.params.id);
            const { page, limit, offset } = getPagination(req.query);
            const { jobPosting, applications } = await JobApplicationService.getJobApplications(id_job_posting, offset, limit);
            const totalPages = getTotalPages(applications.count, limit);
            return res.status(200).json({
                success: true,
                message: '',
                data: {
                    jobPosting,
                    count: applications.count,
                    totalPages,
                    currentPage: page,
                    limit,
                    applications: applications.rows,
                }
            });
        } catch (err: any) {
            Logger.error(`Error al obtener candidatos de la vacante: ${normalizeError(err)}`);
            if (err.message === APP_ERROR.JOB_POSTING_NOT_FOUND) return sendError(res, 404, 'Vacante no encontrada');
            return sendError(res, 500, 'Ocurrio un error al obtener los candidatos');
        }
    }

    static async getJobApplicationDetail(req: TRequestWithUser, res: Response) {
        try {
            const id_job_posting = Number(req.params.id);
            const id_application = Number(req.params.applicationId);
            await JobApplicationService.markInReviewIfApplied(id_job_posting, id_application);
            const application = await JobApplicationService.getJobApplicationDetail(id_job_posting, id_application);
            return sendSuccess(res, 200, '', { application });
        } catch (err: any) {
            Logger.error(`Error al obtener detalle de postulacion: ${normalizeError(err)}`);
            if (err.message === APP_ERROR.APPLICATION_NOT_FOUND) return sendError(res, 404, 'Postulación no encontrada');
            return sendError(res, 500, 'Ocurrio un error al obtener la postulación');
        }
    }

    static async getApplicationResumeUrl(req: TRequestWithUser, res: Response) {
        try {
            const id_job_posting = Number(req.params.id);
            const id_application = Number(req.params.applicationId);
            const application = await JobApplicationService.markInReviewIfApplied(id_job_posting, id_application);
            const fullApplication = await JobApplicationService.getJobApplicationDetail(id_job_posting, id_application);
            if (!fullApplication.resume_snapshot_path) return sendError(res, 404, 'El candidato no tiene CV para esta postulación');
            const url = await StorageService.getSignedResumeUrl(fullApplication.resume_snapshot_path);
            return sendSuccess(res, 200, '', { url, applicationStatus: application.applicationStatus });
        } catch (err: any) {
            Logger.error(`Error al obtener CV de postulacion: ${normalizeError(err)}`);
            if (err.message === APP_ERROR.APPLICATION_NOT_FOUND) return sendError(res, 404, 'Postulación no encontrada');
            return sendError(res, 500, 'Ocurrio un error al obtener el CV');
        }
    }

    static async updateStatus(req: TRequestWithUser, res: Response) {
        try {
            const id_job_posting = Number(req.params.id);
            const id_application = Number(req.params.applicationId);
            const { status } = req.body;
            const application = await JobApplicationService.updateApplicationStatus(id_job_posting, id_application, status);
            return sendSuccess(res, 200, 'Estatus actualizado', { application });
        } catch (err: any) {
            Logger.error(`Error al actualizar estatus de postulacion: ${normalizeError(err)}`);
            if (err.message === APP_ERROR.APPLICATION_NOT_FOUND) return sendError(res, 404, 'Postulación no encontrada');
            if (err.message === APP_ERROR.INVALID_APPLICATION_STATUS) return sendError(res, 400, 'Estatus de postulación inválido');
            return sendError(res, 500, 'Ocurrio un error al actualizar el estatus');
        }
    }
}
