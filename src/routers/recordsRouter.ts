import express from "express";

import { getAllRecordsHandler } from "../controllers/recordsController";

const router = express.Router();

router.get("/", getAllRecordsHandler);

export default router;
