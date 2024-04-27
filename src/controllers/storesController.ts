import { Request, Response } from "express";

import storesService from "../services/storesService";

export async function getStoreByIdHandler(req: Request, res: Response) {
  try {
    const { storeId } = req.params;
    const store = await storesService.getStoreById(storeId);
    res.status(200).json({
      data: store,
      status: "success",
      message: "Store fetched with success",
    });
  } catch (error) {
    console.error("Error retrieving store:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
