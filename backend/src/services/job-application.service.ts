import { UniqueConstraintError } from "sequelize";
import CatApplicationStatus from "../models/cat-application-status.model";
import CandidateProfile from "../models/candidate-profile.model";
import CandidateResume from "../models/candidate-resume.model";
import JobApplication from "../models/job-application.model";
import JobPosting from "../models/job-posting.model";
import CatState from "../models/catalogs/cat-state.model";
import CatWorkModel from "../models/catalogs/cat-work-model.model";
import CatEducationLevel from "../models/catalogs/cat-education-level.model";
import CatExperienceLevel from "../models/catalogs/cat-experience-level.model";
import User from "../models/user.model";
import { APPLICATION_STATUS, MANUAL_APPLICATION_STATUSES } from "../constants/job-application.constants";
import type { TApplicationStatus } from "../types/job-application.type";
import { APP_ERROR } from "../constants/errors.constants";

export default class JobApplicationService {
    static async getStatusByName(name: string) {
        const status = await CatApplicationStatus.findOne({ where: { name } });
        if (!status) throw new Error(APP_ERROR.APPLICATION_STATUS_NOT_FOUND);
        return status;
    }

    static async applyToJob(id_user: number, id_job_posting: number) {
        const profile = await CandidateProfile.findOne({ where: { id_user } });
        const resume = await CandidateResume.findOne({ where: { id_user } });
        if (!profile || !resume) throw new Error(APP_ERROR.PROFILE_INCOMPLETE);

        const jobPosting = await JobPosting.findOne({ where: { id_job_posting, status: 'published' } });
        if (!jobPosting) throw new Error(APP_ERROR.JOB_POSTING_NOT_FOUND);

        const status = await this.getStatusByName(APPLICATION_STATUS.APPLIED);

        try {
            const application = await JobApplication.create({
                id_user,
                id_job_posting,
                id_cat_application_status: status.id_cat_application_status,
                resume_snapshot_path: resume.storage_path,
            });
            return application;
        } catch (err) {
            if (err instanceof UniqueConstraintError) throw new Error(APP_ERROR.ALREADY_APPLIED);
            throw err;
        }
    }

    static async getMyApplicationByJob(id_user: number, id_job_posting: number) {
        return await JobApplication.findOne({
            where: { id_user, id_job_posting },
            include: [{ model: CatApplicationStatus, attributes: ['id_cat_application_status', 'name'] }]
        });
    }

    static async getMyApplications(id_user: number, offset: number, limit: number) {
        return await JobApplication.findAndCountAll({
            where: { id_user },
            include: [
                { model: CatApplicationStatus, attributes: ['id_cat_application_status', 'name'] },
                {
                    model: JobPosting,
                    attributes: ['id_job_posting', 'title', 'salary_min', 'salary_max', 'id_state', 'id_work_model', 'status'],
                    include: [
                        { model: CatState, attributes: ['id_cat_state', 'name'] },
                        { model: CatWorkModel, attributes: ['id_cat_work_model', 'name'] },
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            distinct: true,
        });
    }

    static async getJobApplications(id_job_posting: number, offset: number, limit: number) {
        const jobPosting = await JobPosting.findByPk(id_job_posting, { attributes: ['id_job_posting', 'title'] });
        if (!jobPosting) throw new Error(APP_ERROR.JOB_POSTING_NOT_FOUND);

        const applications = await JobApplication.findAndCountAll({
            where: { id_job_posting },
            include: [
                { model: CatApplicationStatus, attributes: ['id_cat_application_status', 'name'] },
                {
                    model: User,
                    attributes: ['id_user', 'name', 'email'],
                    include: [{ model: CandidateProfile, attributes: ['headline', 'phone'] }]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            distinct: true,
        });

        return { jobPosting, applications };
    }

    static async getJobApplicationDetail(id_job_posting: number, id_application: number) {
        const application = await JobApplication.findOne({
            where: { id_job_application: id_application, id_job_posting },
            include: [
                { model: CatApplicationStatus, attributes: ['id_cat_application_status', 'name'] },
                { model: JobPosting, attributes: ['id_job_posting', 'title'] },
                {
                    model: User,
                    attributes: ['id_user', 'name', 'email'],
                    include: [{
                        model: CandidateProfile,
                        include: [
                            { model: CatState, attributes: ['id_cat_state', 'name'] },
                            { model: CatEducationLevel, attributes: ['id_cat_education_level', 'name'] },
                            { model: CatExperienceLevel, attributes: ['id_cat_experience_level', 'name'] },
                            { model: CatWorkModel, attributes: ['id_cat_work_model', 'name'] },
                        ]
                    }]
                }
            ]
        });
        if (!application) throw new Error(APP_ERROR.APPLICATION_NOT_FOUND);
        return application;
    }

    static async markInReviewIfApplied(id_job_posting: number, id_application: number) {
        const application = await JobApplication.findOne({
            where: { id_job_application: id_application, id_job_posting },
            include: [{ model: CatApplicationStatus, attributes: ['id_cat_application_status', 'name'] }]
        });
        if (!application) throw new Error(APP_ERROR.APPLICATION_NOT_FOUND);

        const status = application.applicationStatus?.name;
        if (status !== APPLICATION_STATUS.APPLIED) return application;

        const inReviewStatus = await this.getStatusByName(APPLICATION_STATUS.IN_REVIEW);
        application.id_cat_application_status = inReviewStatus.id_cat_application_status;
        await application.save();
        await application.reload({
            include: [{ model: CatApplicationStatus, attributes: ['id_cat_application_status', 'name'] }]
        });
        return application;
    }

    static async updateApplicationStatus(id_job_posting: number, id_application: number, statusName: string) {
        if (!MANUAL_APPLICATION_STATUSES.includes(statusName as TApplicationStatus)) {
            throw new Error(APP_ERROR.INVALID_APPLICATION_STATUS);
        }

        const application = await JobApplication.findOne({
            where: { id_job_application: id_application, id_job_posting },
            include: [{ model: CatApplicationStatus, attributes: ['id_cat_application_status', 'name'] }]
        });
        if (!application) throw new Error(APP_ERROR.APPLICATION_NOT_FOUND);

        const newStatus = await this.getStatusByName(statusName);
        application.id_cat_application_status = newStatus.id_cat_application_status;
        await application.save();
        await application.reload({
            include: [{ model: CatApplicationStatus, attributes: ['id_cat_application_status', 'name'] }]
        });
        return application;
    }
}



