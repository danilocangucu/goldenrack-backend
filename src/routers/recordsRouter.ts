import express from "express";

import {
  getAllRecordsHandler,
  getGenresHandler,
  getRecordByIdHandler,
} from "../controllers/recordsController";

const router = express.Router();

router.get("/", getAllRecordsHandler);
router.get("/genres", getGenresHandler);
router.get("/:id", getRecordByIdHandler);

export default router;
