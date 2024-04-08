import mongoose, { Document } from "mongoose";
import { RecordData } from "../types/RecordData";

export type VintageCarDocument = RecordData & Document;

export const RecordSchema = new mongoose.Schema({
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  stock: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<VintageCarDocument>("Record", RecordSchema);
