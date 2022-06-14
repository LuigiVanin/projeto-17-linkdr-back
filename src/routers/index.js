import  authRouter  from "./authRouter.js";
import { Router } from "express";

const router = Router()
router.use(authRouter)

export default router