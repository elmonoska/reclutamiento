import { Router } from "express";
import authRouter from "./auth.routes";
import jobPostingRouter from "./job-posting.routes";
import publicRouter from "./public.routes";

const router = Router();

router.use('/auth', authRouter);

router.use('/job-postings', jobPostingRouter);

router.use('/public', publicRouter);



export default router;
