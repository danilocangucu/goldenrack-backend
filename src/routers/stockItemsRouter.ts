import express from "express";

import {
  createStockItemHandler,
  updateStockItemHandler,
} from "../controllers/stockItemsController";

const stockItemsRouter = express.Router();

stockItemsRouter.put("/:stockItemId", updateStockItemHandler);
stockItemsRouter.post("/", createStockItemHandler);

export default stockItemsRouter;
