import { RecordCondition } from "./RecordConditionData";

export interface StockData {
  id: string;
  storeId: string;
  condition: RecordCondition;
  price: number;
}
