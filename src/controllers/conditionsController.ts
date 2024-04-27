import { Request, Response } from "express";

import conditionsService from "../services/conditionsService";

export async function getConditionsHandler(_req: Request, res: Response) {
  try {
    const conditions = await conditionsService.getConditions();
    res.status(200).json({
      data: conditions,
      status: "success",
      message: "Conditions fetched with success",
    });
  } catch (error) {
    console.error("Error retrieving conditions:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
