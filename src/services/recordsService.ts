import mongoose from "mongoose";
import Genre from "../models/Genre";
import Record from "../models/Record";
import Stock from "../models/Stock";
import Store from "../models/Store";
import { GetRecords, RecordData, GetRecordById } from "../types/RecordData";
import {
  applyValidSearchCriteria,
  fetchAndPopulateRecords,
  fectchAndPopulateRecordById,
} from "../utils/recordsUtils";
import stockItemsService from "./stockItemsService";

const getAllRecords = async ({
  search,
  genres,
  price,
  pagination,
  sortPrice,
}: GetRecords): Promise<RecordData[]> => {
  // TODO typing in this file
  const query: any = {};

  applyValidSearchCriteria(query, search);

  return await fetchAndPopulateRecords(
    query,
    genres,
    price,
    pagination,
    sortPrice
  );
};

// TODO error handling, refactoring getRecordById
const getRecordById = async ({ id }: GetRecordById): Promise<any | null> => {
  const foundRecord = await fectchAndPopulateRecordById(id);

  if (foundRecord) {
    return foundRecord;
  }

  return null;
};

const getGenres = async (): Promise<any | null> => {
  // TODO error handling for getGenres
  return await Genre.find();
};

const createRecordWithStockItem = async ({
  title,
  artist,
  genre,
  description,
  year,
  condition,
  price,
  store,
}: {
  title: string;
  artist: string;
  genre: string;
  description: string;
  year: number;
  condition: string;
  price: number;
  store: string;
}) => {
  const record = { title, artist, genre, description, year };
  const stockItem = { condition, price, store };

  const newRecord = await createRecord(record);
  const addedRecordId = await addRecordToStore(newRecord, stockItem.store);
  // TODO newStockItem is not used
  const newStockItem = await stockItemsService.createStockItem(
    addedRecordId,
    stockItem.store,
    stockItem.condition,
    stockItem.price
  );
};

const createRecord = async (
  recordData: Record<string, any>
): Promise<RecordData> => {
  const newRecord = new Record(recordData);
  const newStock = new Stock();
  await newStock.save();
  newRecord.stock = newStock._id;
  await newRecord.save();
  return newRecord;
};

const addRecordToStore = async (
  record: RecordData,
  storeId: string
): Promise<string> => {
  const foundStore = await Store.findById(storeId);
  if (!foundStore) {
    throw new Error("Store not found");
  }

  foundStore.recordsInStock.push({
    record: record._id as mongoose.Types.ObjectId,
    stockItems: [],
  });
  await foundStore.save();
  return record._id.toString();
};

export default {
  getAllRecords,
  getRecordById,
  getGenres,
  createRecordWithStockItem,
};
