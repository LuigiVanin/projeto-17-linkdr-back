import { Router } from "express";
import { createPost, getPosts, likePost } from "./../controllers/postsController.js";

const postRouter = Router();

postRouter.post("/post", createPost);

postRouter.get("/timeline", getPosts);



//like / unlike
postRouter.put('/like/:postId', likePost);

//mostrar curtidas (react-tooltip)

//editPost (focus useRef (react))
// postRouter.put('/posts/:postId', editPost);
//deletePost (react-modal/dialog)
// postRouter.delete('/posts/:postId', deletePost);


export default postRouter;