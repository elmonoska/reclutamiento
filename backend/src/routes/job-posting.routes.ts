import { Router } from "express";
import JobPostingController from "../controllers/job-posting.controller";
import { validateCookieToken } from "../middlewares/auth.middleware";

const jobPostingRouter: Router = Router();

jobPostingRouter.use(validateCookieToken);

jobPostingRouter.get(
    '/catalogs',
    JobPostingController.getCatalogs
);

jobPostingRouter.post(
    '/create',
    JobPostingController.create
);

export default jobPostingRouter;