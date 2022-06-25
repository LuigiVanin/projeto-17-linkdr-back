import { Router } from 'express';

import { insertFollower, removeFollower } from '../controllers/followersController.js';
import { authentication } from "../middlewares/authMiddleware.js";

const followersRouter = Router();
//followersRouter.use(authentication);

followersRouter.post('/follow/:followerId', authentication, insertFollower);
followersRouter.delete('/unfollow/:followerId', authentication, removeFollower);

export default followersRouter;