// Rota de Hashtags

import { Router } from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import { getHashtag, getTrending } from "../controllers/hashtagController.js";

const hashtagRouter = Router();
hashtagRouter.use(authentication);

hashtagRouter.get("/hashtag/:hashtag", getHashtag);
hashtagRouter.get("/trending", getTrending);

export default hashtagRouter;