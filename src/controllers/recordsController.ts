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

// TODO handle errors with boom and refactoring getRecordByIdHandler
export async function getRecordByIdHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const [foundRecord] = await recordsServices.getRecordById({ id });
    res.send(foundRecord);
  } catch (error) {
    console.error(error);
  }
}

export async function getGenresHandler(req: Request, res: Response) {
  // todo error handling for getGenresHandler
  const genres = await recordsServices.getGenres();
  res.send(genres);
}