import { Request, Response } from "express";

import stockItemsService from "../services/stockItemsService";

export async function updateStockItemHandler(req: Request, res: Response) {
  try {
    // TODO next 4 lines can be refactored into a function "convertBodyToStockItem"
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

export async function createStockItemHandler(req: Request, res: Response) {
  try {
    // TODO next 4 lines can be refactored into a function "convertBodyToStockItem"
    const { recordId, storeId, conditionId, price } = req.body;
    if (!storeId || !conditionId || !price) {
      throw new Error("Store id, condition id and price are required");
    }
    const createdStockItem = await stockItemsService.createStockItem(
      recordId,
      storeId,
      conditionId,
      price
    );
    res.status(201).json({
      data: createdStockItem,
      status: "success",
      message: "Stock Item created with success",
    });
  } catch (error) {
    console.error("Error creating stock item:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

export async function deleteStockItemHandler(req: Request, res: Response) {
  try {
    const { stockItemId } = req.params;
    const { recordId, storeId } = req.body;
    if (!recordId || !storeId) {
      throw new Error("Record id and store id are required");
    }

    const deletionResult = await stockItemsService.deleteStockItem(
      stockItemId,
      storeId,
      recordId
    );
    if (deletionResult) {
      res.status(200).json({
        status: "success",
        message: "Stock Item deleted successfully",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Stock Item not found",
      });
    }
  } catch (error) {
    console.error("Error deleting stock item:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}