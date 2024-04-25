import mongoose, { Document } from "mongoose";
import { StockData } from "../types/StockData";
import { StockItemSchema } from "./StockItem";

export type StockDocument = StockData & Document;

export const StockSchema = new mongoose.Schema({
  stockItems: [
    {
      stockItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StockItem",
        required: true,
      },
    },
  ],
});

export default mongoose.model<StockDocument>("Stock", StockSchema);
