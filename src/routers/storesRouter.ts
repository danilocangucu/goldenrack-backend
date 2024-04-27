import express from "express";

import { getStoreByIdHandler } from "../controllers/storesController";
import stockItemsRouter from "./stockItemsRouter";

const storesRouter = express.Router();

// TODO auth middlewares for stores routes
storesRouter.use("/stockitems", stockItemsRouter);
storesRouter.get("/:storeId", getStoreByIdHandler);

export default storesRouter;
