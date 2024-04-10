import { GetRecords, RecordData } from "../types/RecordData";
import { fetchAndPopulateRecords } from "../utils/recordsUtils";

const getAllRecords = async ({
  searchQuery,
  minPrice,
  maxPrice,
}: GetRecords): Promise<RecordData[]> => {
  const query: any = {};

  if (searchQuery) {
    query.model = { $regex: searchQuery, $options: "i" };
  }

  query["stock.price"] = { $gte: minPrice, $lte: maxPrice };

  return await fetchAndPopulateRecords();
};

export default {
  getAllRecords,
};
