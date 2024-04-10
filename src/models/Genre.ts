import mongoose, { Document } from "mongoose";

import { RecordGenreData, RecordGenre } from "../types/RecordData";

export type GenreDocument = Document & RecordGenreData;

export const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: Object.values(RecordGenre),
    required: true,
  },
});
