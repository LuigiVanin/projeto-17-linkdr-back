// Rota de posts

import { Router } from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import validatePost from "../middlewares/postMiddlewares.js";
import { 
    createPost, updateUserPost, getPosts, likePost, getLiked, getLikes, getNames, deletePost 
} from "./../controllers/postsController.js";

const postRouter = Router();
//postRouter.use(authentication);

postRouter.post("/post", authentication, validatePost, createPost);
postRouter.get("/timeline", authentication, getPosts);

postRouter.put("/post/:postId", authentication, updateUserPost);

//like / unlike
postRouter.post("/like/:postId", authentication, likePost);
postRouter.get("/liked/:postId", authentication, getLiked);

//mostrar curtidas (react-tooltip)
postRouter.get("/likes/:postId", authentication, getLikes);
postRouter.get("/names/:postId", authentication, getNames);

//editPost (focus useRef (react))
// postRouter.put('/posts/:postId', editPost);

//deletePost (react-modal/dialog)
postRouter.delete("/posts/:postId", authentication, deletePost);

export default postRouter;