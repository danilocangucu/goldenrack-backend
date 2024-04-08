import { Request } from "express";

import Record from "../model/Record";

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;
const DEFAULT_SEARCH_QUERY = "";
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = Infinity;

export function parseRecordsQueryParams(req: Request) {
  const {
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
    searchQuery = DEFAULT_SEARCH_QUERY,
    minPrice = DEFAULT_MIN_PRICE,
    maxPrice = DEFAULT_MAX_PRICE,
  } = req.query;

  return {
    limit: Number(limit),
    offset: Number(offset),
    searchQuery: searchQuery as string,
    minPrice: Number(minPrice),
    maxPrice: Number(maxPrice),
  };
}

export async function aggregateRecords(
  minPrice: number,
  maxPrice: number
): Promise<any> {
  return Record.aggregate([
    { $unwind: "$stock" },
    { $match: { "stock.price": { $gte: minPrice, $lte: maxPrice } } },
    { $sort: { "stock.price": 1, year: -1, title: 1 } },
    {
      $group: {
        _id: "$_id",
        genre: { $first: "$genre" },
        title: { $first: "$title" },
        artist: { $first: "$artist" },
        description: { $first: "$description" },
        year: { $first: "$year" },
        stock: { $push: "$stock" },
      },
    },
  ]);
}
