// Rota de Autenticacao

import { Router } from "express";
import { validateSignup, validateSignin } from "../middlewares/authMiddleware.js";
import { signup, signin, logout } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post('/signup', validateSignup, signup);
authRouter.post('/signin', validateSignin, signin);
authRouter.delete('/logout', logout);

export default authRouter;