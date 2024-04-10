import mongoose, { Document } from "mongoose";
import { StockData } from "../types/StockData";

export type StockDocument = StockData & Document;

export const StockItemSchema = new mongoose.Schema({
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
});

export const StockSchema = new mongoose.Schema({
  stock: [StockItemSchema],
});

export default mongoose.model<StockDocument>("Stock", StockSchema);
