import Record, { RecordDocument } from "../model/Record";
import { GetRecords } from "../types/RecordData";
import { aggregateRecords } from "../utils/recordsUtils";

const getAllRecords = async ({
  searchQuery,
  minPrice,
  maxPrice,
}: GetRecords): Promise<RecordDocument[]> => {
  const query: any = {};

  if (searchQuery) {
    query.model = { $regex: searchQuery, $options: "i" };
  }

  query["stock.price"] = { $gte: minPrice, $lte: maxPrice };

  return await aggregateRecords(minPrice!, maxPrice!);
};

export default {
  getAllRecords,
};
