import { GetRecords, RecordData } from "../types/RecordData";
import {
  applyValidSearchCriteria,
  fetchAndPopulateRecords,
} from "../utils/recordsUtils";

const getAllRecords = async ({
  search,
  genres,
  price,
  pagination,
}: GetRecords): Promise<RecordData[]> => {
  // TODO type
  const query: any = {};

  applyValidSearchCriteria(query, search);

  return await fetchAndPopulateRecords(query, genres, price, pagination);
};

export default {
  getAllRecords,
};
