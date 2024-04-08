import mongoose from "mongoose";
import { RecordData } from "./RecordData";
import { StockData } from "./StockData";

export interface OrderData {
  id: string;
  stock: string | StockData;
  record: string | RecordData;
}

export interface OrderListData {
  id: string;
  orders: OrderData[] | mongoose.Types.ObjectId[];
}
