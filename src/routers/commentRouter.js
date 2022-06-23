import {
    createComment,
    getCommentsByPost,
} from "../controllers/commentController.js";
import { Router } from "express";
import { requestValidation } from "../middlewares/commentMiddleware.js";
import { authentication } from "../middlewares/authMiddleware.js";
import commentSchema from "../schemas/commentSchema.js";

const commentRouter = Router();

commentRouter.get("/comment/:postId", authentication, getCommentsByPost);
commentRouter.post(
    "/comment",
    requestValidation(commentSchema),
    authentication,
    createComment
);

export default commentRouter;
