// Router de usuário

import { Router } from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import { getUser, searchUser } from "../controllers/userController.js";

const userRouter = Router();
userRouter.use(authentication);

userRouter.get("/user/:id", getUser);
userRouter.get("/search/:user", searchUser);

export default userRouter;