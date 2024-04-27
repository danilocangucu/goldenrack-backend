import express from "express";

import { getConditionsHandler } from "../controllers/conditionsController";

const conditionsRouter = express.Router();

conditionsRouter.get("/", getConditionsHandler);

export default conditionsRouter;
