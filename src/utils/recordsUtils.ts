import { Request } from "express";

import Record from "../models/Record";
import { populateFieldObj, populateField } from "./dbUtils";
import Stock from "../models/Stock";

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

export async function fetchAndPopulateRecords(): Promise<any[]> {
  const records = await Record.find();

  const stockData = await populateField("stock", "stocks", records, Record);

  const stockWithConditionData = await populateFieldObj(
    "condition",
    "conditions",
    "stock",
    stockData,
    Stock
  );
  const stockWithStoreData = await populateFieldObj(
    "store",
    "stores",
    "stock",
    stockData,
    Stock
  );

  const genreData = await populateField("genre", "genres", records, Record);

  const populatedRecords = transformRecords(
    records,
    stockWithConditionData,
    stockWithStoreData,
    genreData
  );

  return populatedRecords;
}

function transformRecords(
  records: any[],
  stockWithConditionData: any[],
  stockWithStoreData: any[],
  genreData: any[]
): any[] {
  return records.map((record, index) => {
    const stockConditions = mapStockData(
      stockWithConditionData,
      index,
      "condition"
    );
    const stockPrice = mapStockData(stockWithConditionData, index, "price");
    const stockStore = mapStockData(stockWithStoreData, index, "store");
    return {
      ...record.toObject(),
      genre: genreData[index],
      stock: stockConditions.map((condition: any, i: number) => ({
        condition,
        price: stockPrice[i],
        store: stockStore[i],
      })),
    };
  });
}

function mapStockData(stockData: any[], index: number, field: string): any[] {
  return stockData[index]?.stock.map((item: any) => item[field]) ?? [];
}