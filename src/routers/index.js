import  authRouter  from "./authRouter.js";
import  userRouter  from "./userRouter.js";
import { Router } from "express";

const router = Router()
router.use(authRouter);
router.use(userRouter);

export default router;