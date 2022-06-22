// Router para usuário
import { Router } from "express";

import {
    getUser,
    searchUser,
    getCurrentUser,
} from "../controllers/userController.js";
import { validToken } from "../middlewares/token.js";
import authentication from "../middlewares/authentication.js";

const userRouter = Router();

userRouter.get("/user/:id", authentication, getUser);
userRouter.get("/search/:user", authentication, searchUser);
userRouter.get("/user", authentication, getCurrentUser);

export default userRouter;
