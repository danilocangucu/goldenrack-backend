import mongoose, { Document } from "mongoose";
import { OrderData } from "../types/OrderData";

export type OrderDocument = Document & OrderData;

export const OrderSchema = new mongoose.Schema({
  record: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Record",
    required: true,
  },
  stockItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StockItem",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<OrderDocument>("Order", OrderSchema);
