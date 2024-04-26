import mongoose from "mongoose";
import { RecordData } from "./RecordData";
import { StockData } from "./StockData";

export interface OrderData {
  stock: string | StockData;
  stockItem: string;
  record: string | RecordData;
}

export interface OrderListData {
  id: string;
  orders: OrderData[] | mongoose.Types.ObjectId[];
  paid: boolean;
}
