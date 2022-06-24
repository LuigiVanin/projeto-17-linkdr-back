// Rota de Hashtags

import { Router } from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import { getHashtag, getTrending } from "../controllers/hashtagController.js";

const hashtagRouter = Router();
//hashtagRouter.use(authentication);

hashtagRouter.get("/hashtag/:hashtag", authentication, getHashtag);
hashtagRouter.get("/trending", authentication, getTrending);

export default hashtagRouter;