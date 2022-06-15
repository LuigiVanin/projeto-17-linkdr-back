import { Router } from "express";
import { createPost, getPosts } from "./../controllers/postsController.js";

const postRouter = Router();

postRouter.post("/post", createPost);

postRouter.get("/timeline", getPosts);

export default postRouter;