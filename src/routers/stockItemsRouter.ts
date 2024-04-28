import express from "express";

import {
  createStockItemHandler,
  updateStockItemHandler,
  deleteStockItemHandler,
} from "../controllers/stockItemsController";

const stockItemsRouter = express.Router();

stockItemsRouter.put("/:stockItemId", updateStockItemHandler);
stockItemsRouter.post("/", createStockItemHandler);
stockItemsRouter.delete("/:stockItemId", deleteStockItemHandler);

export default stockItemsRouter;
