import { Types } from "mongoose";
import { RecordCondition } from "./RecordData";
import { StoreData } from "./StoreData";

export interface StockData {
  _id: string | Types.ObjectId;
  store: string | Types.ObjectId | StoreData;
  condition: string | Types.ObjectId | RecordCondition;
  price: number;
  stockItems: Array<{
    stockItem: string | Types.ObjectId | StockItemData;
  }>;
}

export interface StockItemData {
  _id: {
    $oid: string | Types.ObjectId;
  };
  condition: {
    $oid: string | Types.ObjectId;
  };
  price: number;
  store: {
    $oid: string | Types.ObjectId;
  };
}