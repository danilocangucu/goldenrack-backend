import { Request } from "express";

import Record from "../models/Record";
import { mapFields, populateField } from "./dbUtils";
import Stock from "../models/Stock";
import Store from "../models/Store";

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

// TODO refactoring for calling populateField & mapField
export async function fetchAndPopulateRecords(): Promise<any> {
  const records = await Record.find();

  const stockData = await populateField(
    { fieldName: "stock" },
    records,
    Record
  );

  const genreData = await populateField(
    { fieldName: "genre" },
    records,
    Record
  );

  const conditionData = await populateField(
    { fieldName: "condition", unwind: "stock" },
    stockData,
    Stock
  );

  const storeData = await populateField(
    { fieldName: "store", unwind: "stock" },
    stockData,
    Stock
  );

  const shippingInfoInStore = await Promise.all(
    storeData.map(async (storesInRecord) => {
      const shippingInfoPromise = populateField(
        {
          fieldName: "shippingInfo",
          extraMatch: "_id",
        },
        storesInRecord,
        Store
      );
      return await shippingInfoPromise;
    })
  );

  const transformedStoreData = mapFields(
    storeData,
    shippingInfoInStore,
    "shippingInfo"
  );

  const transformedStockWithStores = mapFields(
    stockData,
    transformedStoreData,
    "stock",
    "store"
  );

  const populatedStocks = mapFields(
    transformedStockWithStores,
    conditionData,
    "stock",
    "condition"
  );

  const recordsWithGenres = mapFields(records, genreData, "genre");

  const populatedRecords = mapFields(
    recordsWithGenres,
    populatedStocks,
    "stock"
  );

  return populatedRecords;
}