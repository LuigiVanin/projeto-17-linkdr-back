import {
    createComment,
    getCommentsByPost,
} from "../controllers/commentController.js";
import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import { requestValidation } from "../middlewares/validation.js";
import commentSchema from "../schemas/commentScheam.js";

const commentRouter = Router();

commentRouter.get("/comment/:postId", authentication, getCommentsByPost);
commentRouter.post(
    "/comment",
    requestValidation(commentSchema),
    authentication,
    createComment
);

export default commentRouter;
