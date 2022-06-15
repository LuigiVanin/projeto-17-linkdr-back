import authRouter from "./authRouter.js";
import hashtagRouter from "./hashtagRouter.js";
import { Router } from "express";

const router = Router();

router.use(authRouter);
router.use(hashtagRouter);

export default router;
