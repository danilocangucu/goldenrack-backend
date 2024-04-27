import express from "express";

import { updateStockItemHandler } from "../controllers/stockItemsController";

const stockItemsRouter = express.Router();

stockItemsRouter.put("/:stockItemId", updateStockItemHandler);

export default stockItemsRouter;
