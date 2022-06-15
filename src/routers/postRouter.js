import { Router } from "express";


const postRouter = Router();

//like / unlike
postRouter.put('/like/:postId', validate, likePost);
postRouter.put('/unlike/:postId', validate, unlikePost);

//mostrar curtidas (react-tooltip)


//editPost (focus useRef (react))
postRouter.put('/posts/:postId', validate, editPost);

//deletePost (react-modal/dialog)
postRouter.delete('/posts/:postId', validate, deletePost);


export default postRouter;