import mongoose, { Document } from "mongoose";
import { OrderListData } from "../types/OrderData";

export type OrderListDocument = Document & OrderListData;

const OrderListSchema = new mongoose.Schema({
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

export default mongoose.model<OrderListDocument>("OrderList", OrderListSchema);
