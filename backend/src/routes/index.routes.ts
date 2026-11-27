import { Router } from "express";
import authRouter from "./auth.routes";
import jobPostingRouter from "./job-posting.routes";
import publicRouter from "./public.routes";
import candidateRouter from "./candidate.routes";
import accountRouter from "./account.routes";

const router = Router();

router.use('/auth', authRouter);

router.use('/job-postings', jobPostingRouter);

router.use('/public', publicRouter);

router.use('/candidate', candidateRouter);

router.use('/account', accountRouter);

export default router;
