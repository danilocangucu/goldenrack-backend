import { Types } from "mongoose";
import { RecordCondition } from "./RecordData";
import { StoreData } from "./StoreData";

export interface StockData {
  _id: string | Types.ObjectId;
  stock:
    | {
        store: string | Types.ObjectId | StoreData;
        condition: string | Types.ObjectId | RecordCondition;
        price: number;
      }
    | Types.ObjectId;
}
