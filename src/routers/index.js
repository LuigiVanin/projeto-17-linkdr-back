import  authRouter  from "./authRouter.js";
import postRouter from "./postRouter.js";
import { Router } from "express";

const router = Router()
router.use(authRouter)
router.use(postRouter)

export default router