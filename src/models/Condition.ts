import mongoose, { Document } from "mongoose";

import { RecordConditionData, RecordCondition } from "../types/RecordData";

export type ConditionDocument = Document & RecordConditionData;

export const ConditionSchema = new mongoose.Schema({
  condition: {
    type: String,
    enum: Object.values(RecordCondition),
    required: true,
  },
});
