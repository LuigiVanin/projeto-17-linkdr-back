// Router para usuário
import {Router} from 'express';

import { getUser } from '../controllers/userController.js';
import { validToken } from '../middlewares/token.js';

const  userRouter = Router();

userRouter.get('/user/:id', validToken, getUser);

export default userRouter;
