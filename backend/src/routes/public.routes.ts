import { Router } from "express";
import { param } from "express-validator";
import PublicJobPostingController from "../controllers/public-job-posting.controller";
import { handleInputErrors } from "../middlewares/index.middleware";

const publicRouter = Router();

publicRouter.get('/job-postings/catalogs', PublicJobPostingController.getCatalogs);

publicRouter.get('/job-postings', PublicJobPostingController.getPublishedJobPostings);

publicRouter.get(
    '/job-postings/:id',
    param('id').isInt({ min: 1 }).withMessage('Id invalido').toInt(),
    handleInputErrors,
    PublicJobPostingController.getPublishedJobPostingById
);

export default publicRouter;
