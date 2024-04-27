import mongoose, { Document } from "mongoose";
import { StoreData } from "../types/StoreData";

export type StoreDocument = StoreData & Document;

export const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  openingHours: {
    type: String,
    required: true,
  },
  returnPolicy: {
    type: String,
    required: true,
  },
  featuredItems: {
    type: [String],
    required: true,
  },
  shippingInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShippingInfo",
    required: true,
  },
  recordsInStock: [
    {
      record: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record",
        required: true,
      },
      stockItems: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "StockItem",
          required: true,
        },
      ],
    },
  ],
});

export default mongoose.model<StoreDocument>("Store", StoreSchema);
