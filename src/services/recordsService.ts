import Genre from "../models/Genre";
import { GetRecords, RecordData, GetRecordById } from "../types/RecordData";
import {
  applyValidSearchCriteria,
  fetchAndPopulateRecords,
  fectchAndPopulateRecordById,
} from "../utils/recordsUtils";

const getAllRecords = async ({
  search,
  genres,
  price,
  pagination,
}: GetRecords): Promise<RecordData[]> => {
  // TODO typing in this file
  const query: any = {};

  applyValidSearchCriteria(query, search);

  return await fetchAndPopulateRecords(query, genres, price, pagination);
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

export default {
  getAllRecords,
  getRecordById,
  getGenres,
};
