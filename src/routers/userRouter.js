// Router para usuário
import { Router } from "express";

import { getUser, searchUser } from "../controllers/userController.js";
import { validToken } from "../middlewares/token.js";
import authentication from "../middlewares/authentication.js";

const userRouter = Router();

userRouter.get("/user/:id", authentication, getUser);
userRouter.get("/search/:user", authentication, searchUser);

export default userRouter;
