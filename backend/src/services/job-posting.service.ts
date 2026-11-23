import { Op } from "sequelize";
import JobPosting from "../models/job-posting.model";

export default class JobPostingService {
    static async createJobPosting(body, id_user) {
        await JobPosting.create({...body, created_by: id_user});
    }

    static async getLastJobPostings() {
        const jobPostings = await JobPosting.findAll({
            where: {deleted_at: null},
            order: [['id_job_posting', 'DESC']],
            limit: 10
        });
        return jobPostings;
    }

    static async getJobPostingById(id: number) {
        const jobPosting = await JobPosting.findByPk(id, { paranoid: false });
        if (!jobPosting) {
            throw new Error('NOT_FOUND');
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

        if (status === 'deleted') {
            where.deleted_at = { [Op.ne]: null };
        } else if (status === 'published' || status === 'closed') {
            where.status = status;
            where.deleted_at = null;
        }

        return await JobPosting.findAndCountAll({
            where,
            offset,
            limit,
            order: [['id_job_posting', 'DESC']],
            paranoid: false
        });
    }

    static async deleteJobPostingById(jobPosting: JobPosting) {
        await jobPosting.destroy();
    }

    static async getPublishedJobPostings(offset: number, limit: number, filters: { search?: string; id_employment_type?: number; id_state?: number; id_work_model?: number } = {}) {
        const where: any = { status: 'published' };

        if (filters.search) {
            where.title = { [Op.iLike]: `%${filters.search}%` };
        }
        if (filters.id_employment_type) where.id_employment_type = filters.id_employment_type;
        if (filters.id_state) where.id_state = filters.id_state;
        if (filters.id_work_model) where.id_work_model = filters.id_work_model;

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
            throw new Error('NOT_FOUND');
        }
        return jobPosting;
    }
}