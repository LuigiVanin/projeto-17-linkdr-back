// Rota de URL

import { Router } from "express";   
import getUrlMetadata from "../controllers/urlController.js";

const urlRouter = Router();

urlRouter.post('/getMetaData', getUrlMetadata);

export default urlRouter;