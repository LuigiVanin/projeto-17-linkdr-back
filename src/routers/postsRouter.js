import { Router } from "express";
import { validateToken } from "../middlewares/validation.js";
import {
    createPost,
    updateUserPost,
    getPosts,
    likePost,
    getLiked,
    getLikes,
    getNames,
    deletePost,
} from "./../controllers/postsController.js";

const postRouter = Router();

postRouter.post("/post", validateToken, createPost);

postRouter.put('/post/:postId', validateToken, updateUserPost)

postRouter.get("/timeline", validateToken, getPosts);

//like / unlike
postRouter.post("/like/:postId", likePost);
postRouter.get("/liked/:postId", getLiked);

//mostrar curtidas (react-tooltip)
postRouter.get("/likes/:postId", getLikes);
postRouter.get("/names/:postId", getNames);

//editPost (focus useRef (react))
// postRouter.put('/posts/:postId', editPost);

//deletePost (react-modal/dialog)
postRouter.delete("/posts/:postId", deletePost);

export default postRouter;
