import mongoose, { Document } from "mongoose";
import { ShippingInfoData } from "../types/StoreData";

export type ShippingInfoDocument = ShippingInfoData & Document;

export const ShippingInfoSchema = new mongoose.Schema({
  domestic: {
    standard: String,
    express: String,
  },
  international: {
    economy: String,
    express: String,
  },
});

export default mongoose.model<ShippingInfoDocument>(
  "Store",
  ShippingInfoSchema
);
