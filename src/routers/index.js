
import userRouter  from "./userRouter.js";
import authRouter from "./authRouter.js";
import postsRouter from "./postsRouter.js";
import hashtagRouter from "./hashtagRouter.js";
import urlRouter from "./urlRouter.js";
import commentRouter from "./commentRouter.js";
import followersRouter from "./followersRouter.js";
import likesRouter from "./likesRouter.js";
import { Router } from "express";

const router = Router()
router.use(authRouter)
router.use(postsRouter)
router.use(hashtagRouter)
router.use(urlRouter)
router.use(userRouter);
router.use(commentRouter);
router.use(followersRouter);
router.use(likesRouter);

export default router;