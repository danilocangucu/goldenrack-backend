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
  paid: {
    type: Boolean,
    default: false,
    required: true,
  },
});

export default mongoose.model<OrderListDocument>("OrderList", OrderListSchema);
