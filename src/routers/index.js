import  authRouter  from "./authRouter.js";
import postsRouter from "./postsRouter.js";
import { Router } from "express";

const router = Router()
router.use(authRouter)
router.use(postsRouter)

export default router