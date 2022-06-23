import { Router } from 'express';

import { insertFollower, removeFollower } from '../controllers/followersController.js';
import { authentication } from "../middlewares/authMiddleware.js";

const followersRouter = Router();
followersRouter.use(authentication);

followersRouter.post('/follow/:followerId', insertFollower);
followersRouter.delete('/unfollow/:followerId', removeFollower);

export default followersRouter;