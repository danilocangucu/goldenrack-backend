import { Request, Response } from "express";

import stockItemsService from "../services/stockItemsService";

export async function updateStockItemHandler(req: Request, res: Response) {
  try {
    const { conditionId, price } = req.body;
    if (!conditionId || !price) {
      throw new Error("Condition id and price are required");
    }
    const { stockItemId } = req.params;
    const updatedStockItem = await stockItemsService.updateStockItem(
      stockItemId,
      conditionId,
      price
    );
    res.status(200).json({
      data: updatedStockItem,
      status: "success",
      message: "Stock Item updated with success",
    });
  } catch (error) {
    console.error("Error updating stock item:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
