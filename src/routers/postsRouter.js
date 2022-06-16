import { Router } from "express";
import { createPost, getPosts, likePost, getLiked, getLikes } from "./../controllers/postsController.js";

const postRouter = Router();

postRouter.post("/post", createPost);

postRouter.get("/timeline", getPosts);

//like / unlike
postRouter.post('/like/:postId', likePost);
postRouter.get('/liked/:postId', getLiked);

//mostrar curtidas (react-tooltip)
postRouter.get('/likes/:postId', getLikes);

//editPost (focus useRef (react))
// postRouter.put('/posts/:postId', editPost);


//deletePost (react-modal/dialog)
// postRouter.delete('/posts/:postId', deletePost);


export default postRouter;