import { validateSignin, validateSignup } from "../middlewares/validation.js";
import { Router } from "express";
import { signin, signup } from "../controllers/authController.js";

const authRouter = Router()

authRouter.post('/signup', validateSignup, signup)
authRouter.post('/signin', validateSignin, signin)

export default authRouter;