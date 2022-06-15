import { getHashtag } from "../controllers/hashtagController.js";
import { Router } from "express";

const hashtagRouter = Router();

hashtagRouter.get("/hashtag/:hashtag", getHashtag);

export default hashtagRouter;
