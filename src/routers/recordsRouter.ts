import express from "express";

import {
  createRecordWithStockHandler,
  getAllRecordsHandler,
  getGenresHandler,
  getRecordByIdHandler,
} from "../controllers/recordsController";
import conditionsRouter from "./conditionsRouter";

const router = express.Router();

router.use("/conditions", conditionsRouter);
router.get("/", getAllRecordsHandler);
router.get("/genres", getGenresHandler);
router.get("/:id", getRecordByIdHandler);
router.post("/", createRecordWithStockHandler);

export default router;
