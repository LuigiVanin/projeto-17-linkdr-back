import { validateSignup } from "../middlewares/auth.js";
import { Router } from "express";
import { signup } from "../controllers/authController.js";

const authRouter = Router()
authRouter.post('/signup', validateSignup, signup)

export default authRouter