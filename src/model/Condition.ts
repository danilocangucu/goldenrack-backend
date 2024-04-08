import mongoose, { Document } from 'mongoose';

import {
  RecordConditionData,
  RecordCondition,
} from "../types/RecordConditionData";

export type ConditionDocument = Document & RecordConditionData;

export const ConditionSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: Object.values(RecordCondition),
    required: true,
  },
});