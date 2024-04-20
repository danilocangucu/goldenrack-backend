import { Types } from "mongoose";
// TODO fix StockData & stock field in RecordData
// import { StockData } from "./StockData";
import { Document } from "mongoose";

export interface RecordData {
  _id: string | Types.ObjectId;
  genre: Types.ObjectId | RecordGenreData;
  title: string;
  artist: string;
  description: string;
  year: number;
  stock: any;
}

export interface GetRecords {
  search?: {
    artist?: string;
    title?: string;
  };
  genres?: string;
  price?: {
    min?: number;
    max?: number;
  };
  pagination?: {
    limit?: number;
    offset?: number;
  };
}

export interface GetRecordById {
  id: string;
}

export interface IdBaseData {
  _id: string | Types.ObjectId;
}

export interface RecordConditionData extends IdBaseData {
  name: RecordCondition;
}

export enum RecordCondition {
  New = "New",
  LikeNew = "Like New",
  VeryGood = "Very Good",
  Good = "Good",
  Fair = "Fair",
}

export interface RecordGenreData extends IdBaseData {
  name: RecordGenre;
}

export enum RecordGenre {
  ProgressiveRock = "ProgressiveRock",
  Rock = "Rock",
  Pop = "Pop",
  Jazz = "Jazz",
  Classical = "Classical",
  HipHop = "Hip Hop",
  Electronic = "Electronic",
  Blues = "Blues",
  Country = "Country",
  Folk = "Folk",
  Reggae = "Reggae",
  Latin = "Latin",
  World = "World",
  Other = "Other",
}

export interface ExtendedRecordData extends Omit<RecordData, "_id">, Document {}
