import express from "express";

import { getConditionsHandler } from "../controllers/conditionsController";

const conditionsRouter = express.Router();

// TODO implement more methods in conditionsRouter
conditionsRouter.get("/", getConditionsHandler);

export default conditionsRouter;
