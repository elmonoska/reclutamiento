import { fn, col, Op } from "sequelize";
import JobPosting from "../models/job-posting.model";
import JobApplication from "../models/job-application.model";
import User from "../models/user.model";
import { APP_ERROR } from "../constants/errors.constants";
import { JOB_POSTING_LIST_STATUS, JOB_POSTING_STATUS } from "../constants/job-posting.constants";

export default class JobPostingService {
    static async createJobPosting(body, id_user) {
        await JobPosting.create({...body, created_by: id_user});
    }

    static async getLastJobPostings() {
        const jobPostings = await JobPosting.findAll({
            where: { deleted_at: null },
            attributes: {
                include: [[fn('COUNT', col('jobApplications.id_job_application')), 'applications_count']]
            },
            include: [{ model: JobApplication, attributes: [], required: false }],
            group: ['JobPosting.id_job_posting'],
            order: [['id_job_posting', 'DESC']],
            limit: 10,
            subQuery: false,
        });
        return jobPostings;
    }

    static async getJobPostingById(id: number) {
        const jobPosting = await JobPosting.findByPk(id, {
            paranoid: false,
            include: [{ model: User, as: 'createdBy', attributes: ['id_user', 'name'] }]
        });
        if (!jobPosting) {
            throw new Error(APP_ERROR.NOT_FOUND);
        }
        return jobPosting;
    }

    static async editJobPostingById(jobPosting: JobPosting, body) {
        await jobPosting.update(body);
    }

    static async getJobPostings(offset: number, limit: number, search?: string, status?: string) {
        const where: any = {};

        if (search) {
            where.title = { [Op.iLike]: `%${search}%` };
        }

        if (status === JOB_POSTING_LIST_STATUS.DELETED) {
            where.deleted_at = { [Op.ne]: null };
        } else if (status === JOB_POSTING_STATUS.PUBLISHED || status === JOB_POSTING_STATUS.CLOSED) {
            where.status = status;
            where.deleted_at = null;
        }

        return await JobPosting.findAndCountAll({
            where,
            attributes: {
                include: [[fn('COUNT', col('jobApplications.id_job_application')), 'applications_count']]
            },
            include: [{ model: JobApplication, attributes: [], required: false }],
            group: ['JobPosting.id_job_posting'],
            offset,
            limit,
            order: [['id_job_posting', 'DESC']],
            paranoid: false,
            subQuery: false,
            distinct: true,
        });
    }

    static async deleteJobPostingById(jobPosting: JobPosting) {
        await jobPosting.destroy();
    }

    static async getPublishedJobPostings(offset: number, limit: number, filters: { search?: string; id_employment_type?: number; id_state?: number; id_work_model?: number; id_job_category?: number } = {}) {
        const where: any = { status: JOB_POSTING_STATUS.PUBLISHED };

        if (filters.search) {
            where.title = { [Op.iLike]: `%${filters.search}%` };
        }
        if (filters.id_employment_type) where.id_employment_type = filters.id_employment_type;
        if (filters.id_state) where.id_state = filters.id_state;
        if (filters.id_work_model) where.id_work_model = filters.id_work_model;
        if (filters.id_job_category) where.id_job_category = filters.id_job_category;

        return await JobPosting.findAndCountAll({
            where,
            offset,
            limit,
            order: [['id_job_posting', 'DESC']]
        });
    }

    static async getPublishedJobPostingById(id: number) {
        const jobPosting = await JobPosting.findOne({
            where: { id_job_posting: id, status: 'published' }
        });
        if (!jobPosting) {
            throw new Error(APP_ERROR.NOT_FOUND);
        }
        return jobPosting;
    }
}
