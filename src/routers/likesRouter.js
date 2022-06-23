import { Router } from "express";
// import { authentication } from "../middlewares/authMiddleware.js";
// import validatePost from "../middlewares/postMiddlewares.js";
import {
    likePost,
    getLiked,
    getLikes,
    getNames,
} from "./../controllers/likesController.js";

const likesRouter = Router();


likesRouter.post("/like/:postId",  likePost);
likesRouter.get("/liked/:postId", getLiked);

likesRouter.get("/likes/:postId",  getLikes);
likesRouter.get("/names/:postId", getNames);




export default likesRouter;