// Rota Geral

import { Router } from "express";
import authRouter from "./authRouter.js";
import postsRouter from "./postsRouter.js";
import userRouter from "./userRouter.js";
import hashtagRouter from "./hashtagRouter.js";
import urlRouter from "./urlRouter.js";
import followersRouter from "./followersRouter.js";
import commentRouter from "./commentRouter.js";


const router = Router();

router.use(authRouter);
router.use(postsRouter);
router.use(userRouter);
router.use(hashtagRouter);
router.use(urlRouter);
router.use(followersRouter);
router.use(commentRouter);


export default router;
