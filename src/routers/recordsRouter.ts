import express from "express";

import {
  createRecordWithStockHandler,
  getAllRecordsHandler,
  getGenresHandler,
  getRecordByIdHandler,
} from "../controllers/recordsController";
import conditionsRouter from "./conditionsRouter";

const router = express.Router();

router.get("/genres", getGenresHandler);
router.use("/conditions", conditionsRouter);

router.get("/", getAllRecordsHandler);
router.post("/", createRecordWithStockHandler);
router.get("/:id", getRecordByIdHandler);

export default router;
