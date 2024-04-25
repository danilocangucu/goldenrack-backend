import mongoose, { Document } from "mongoose";
import { StockData } from "../types/StockData";

export type StockItemDocument = StockData & Document;

export const StockItemSchema = new mongoose.Schema(
  {
    condition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Condition",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { collection: "stockItems" }
); // Corrected line

export default mongoose.model<StockItemDocument>("StockItem", StockItemSchema);
