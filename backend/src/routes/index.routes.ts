import { Router } from "express";
import authRouter from "./auth.routes";
import jobPostingRouter from "./job-posting.routes";

const router = Router();

router.use('/auth', authRouter);

router.use('/job-postings', jobPostingRouter);

export default router;
