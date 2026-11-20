import JobPosting from "../models/job-posting.model";

export default class JobPostingService {
    static async createJobPosting(body, id_user) {
        await JobPosting.create({...body, created_by: id_user});
    }

    static async getLastJobPostings() {
        const jobPostings = await JobPosting.findAll({
            where: {deleted_at: null},
            order: [['created_at', 'DESC']],
            limit: 10
        });
        return jobPostings;
    }

    static async getJobPostingById(id) {
        const jobPosting = await JobPosting.findByPk(id, {paranoid: false});
        if (!jobPosting) {
            throw new Error('NOT_FOUND');
        }
        return jobPosting;

    }

    static async editJobPostingById(id, body) {
        const jobPosting = await JobPosting.findByPk(id, {paranoid: false});
        if (!jobPosting) {
            throw new Error('NOT_FOUND');
        }

        await jobPosting.update(body);
    }

    static async getJobPostings(offset: number, limit: number) {
        return await JobPosting.findAndCountAll({offset, limit, order: [['id_job_posting', 'DESC']]});
    }
}