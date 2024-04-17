import { Request, Response } from "express";

import recordsServices from "../services/recordsService";
import { parseRecordsQueryParams } from "../utils/recordsUtils";

export async function getAllRecordsHandler(req: Request, res: Response) {
  try {
    const { limit, offset, artist, title, genres, min, max } =
      parseRecordsQueryParams(req);

    const records = await recordsServices.getAllRecords({
      search: { artist, title },
      genres,
      price: { min, max },
      pagination: { limit, offset },
    });

    res.status(200).json({
      data: records,
      message: "Records retrieved successfully",
      status: "success",
    });
  } catch (error) {
    if (error) {
      console.error("Error while fetching cars:", error);
      res.status(500).json({
        message: "Internal server error",
        status: "error",
      });
    }
  }
}
