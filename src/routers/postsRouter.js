// Rota de posts

import { Router } from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import validatePost from "../middlewares/postMiddlewares.js";
import { 
    createPost, updateUserPost, getPosts, deletePost, getRepost, postRepost 
} from "./../controllers/postsController.js";

const postRouter = Router();
//postRouter.use(authentication);

postRouter.post("/post", authentication, validatePost, createPost);
postRouter.get("/timeline", authentication,  getPosts);

postRouter.put("/post/:postId", authentication,  updateUserPost);

postRouter.delete("/posts/:postId", authentication,  deletePost);

postRouter.get("/repost/:postId", authentication, getRepost);

postRouter.post("/repost/:postId", authentication, postRepost);

export default postRouter;