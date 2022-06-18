import { getHashtag, getTrending } from "../controllers/hashtagController.js";
import { Router } from "express";
import authentication from "../middlewares/authentication.js";

const hashtagRouter = Router();

hashtagRouter.get("/hashtag/:hashtag", authentication, getHashtag);
hashtagRouter.get("/trending", authentication, getTrending);

export default hashtagRouter;
