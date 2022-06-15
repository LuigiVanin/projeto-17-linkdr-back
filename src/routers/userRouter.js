// Router para usuário
import {Router} from 'express';

import { getUser, searchUser } from '../controllers/userController.js';
import { validToken } from '../middlewares/token.js';

const  userRouter = Router();

userRouter.get('/user/:id', validToken, getUser);
userRouter.get('/user/search/:user', validToken, searchUser);

export default userRouter;
