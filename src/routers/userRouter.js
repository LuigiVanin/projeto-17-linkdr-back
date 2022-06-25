// Router de usuário

import { Router } from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import { getUser, searchUser } from "../controllers/userController.js";

const userRouter = Router();
//userRouter.use(authentication);

userRouter.get("/user/:id", authentication, getUser);
userRouter.get("/search/:search", authentication, searchUser);

userRouter.get("/friends", authentication);


export default userRouter;