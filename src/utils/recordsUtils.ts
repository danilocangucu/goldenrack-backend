import { Request } from "express";

import Record from "../models/Record";
import { mapFields, populateField } from "./dbUtils";
import Stock from "../models/Stock";
import Store from "../models/Store";

const DEFAULT_LIMIT = process.env.DEFAULT_LIMIT_QUERY;
const DEFAULT_OFFSET = process.env.DEFAULT_OFFSET_QUERY;
const DEFAULT_SEARCH_ARTIST = process.env.DEFAULT_SEARCH_ARTIST_QUERY;
const DEFAULT_SEARCH_TITLE = process.env.DEFAULT_SEARCH_TITLE_QUERY;
const DEFAULT_GENRES = process.env.DEFAULT_GENRES_QUERY || undefined;
const DEFAULT_MIN_PRICE = process.env.DEFAULT_MIN_PRICE_QUERY;
const DEFAULT_MAX_PRICE = process.env.DEFAULT_MAX_PRICE_QUERY;

export function parseRecordsQueryParams(req: Request) {
  const {
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
    artist = DEFAULT_SEARCH_ARTIST,
    title = DEFAULT_SEARCH_TITLE,
    genres = DEFAULT_GENRES,
    min = DEFAULT_MIN_PRICE,
    max = DEFAULT_MAX_PRICE,
  } = req.query;

  return {
    limit: Number(limit),
    offset: Number(offset),
    artist: artist as string,
    title: title as string,
    genres: genres === "undefined" ? undefined : (genres as string),
    min: Number(min),
    max: Number(max),
  };
}

// TODO refactoring for calling populateField & mapField
export async function fetchAndPopulateRecords(
  query?: any,
  genres?: any,
  price?: any,
  pagination?: any
): Promise<any> {
  const { limit, offset } = pagination;

  const queryBuilder = Record.find(query).limit(limit).skip(offset);
  const queryRecords = await queryBuilder.exec();

  let filteredRecords = queryRecords;

  let stockData = await populateField(
    { fieldName: "stock" },
    filteredRecords,
    Record
  );

  if (!isPriceDefault(price)) {
    stockData = filterRecordsByPrice(stockData, price.min, price.max);
    filteredRecords = updateFilteredRecords(
      filteredRecords,
      "stock",
      stockData
    );
  }

  let genreData = await populateField(
    { fieldName: "genre" },
    filteredRecords,
    Record
  );

  if (genres) {
    genreData = filterGenreData(genreData, parseGenres(genres));
    filteredRecords = updateFilteredRecords(
      filteredRecords,
      "genre",
      genreData
    );
    stockData = updateStockData(filteredRecords, stockData);
  }

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

  const recordsWithGenres = mapFields(filteredRecords, genreData, "genre");

  const populatedRecords = mapFields(
    recordsWithGenres,
    populatedStocks,
    "stock"
  );

  return populatedRecords;
}

export async function fectchAndPopulateRecordById(id: string) {
  const foundRecord = await Record.findById(id);

  const stockData = await populateField(
    { fieldName: "stock" },
    [foundRecord]!,
    Record
  );

  const genreData = await populateField(
    { fieldName: "genre" },
    [foundRecord]!,
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

  const recordsWithGenres = mapFields([foundRecord], genreData, "genre");

  const populatedRecords = mapFields(
    recordsWithGenres,
    populatedStocks,
    "stock"
  );

  return populatedRecords;
}

function filterRecordsByPrice(records: any, minPrice: any, maxPrice: any) {
  return records.filter((record: any) => {
    if (record.stock && Array.isArray(record.stock)) {
      const filteredStock = record.stock.filter((item: any) => {
        const price = item.price;
        return price >= minPrice && price <= maxPrice;
      });

      if (filteredStock.length > 0) {
        record.stock = filteredStock;
        return true;
      } else {
        return false;
      }
    }

    return false;
  });
}

export function updateFilteredRecords(
  filteredRecords: any[],
  filterKey: string,
  filterData: any[]
): any[] {
  const updatedRecords = filteredRecords.filter((record) => {
    const matchingItem = filterData.find((item) => {
      return String(item._id) === String(record[filterKey]?._id);
    });
    return !!matchingItem; // Keep only records that have a matching item for the specified key
  });

  return updatedRecords;
}

function hasValidSearchCriteria(search: any) {
  return (
    search && Object.values(search).filter((value) => value !== "").length > 0
  );
}

function addRegexQuery(query: any, fieldName: any, value: any) {
  if (value) {
    query[fieldName] = { $regex: value, $options: "i" };
  }
}

function extractValidFields(
  obj: Record<string, string>
): Record<string, string> {
  return Object.entries(obj)
    .filter(([_key, value]) => typeof value === "string" && value.trim() !== "")
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
}

export function applyValidSearchCriteria(query: any, search: any) {
  if (hasValidSearchCriteria(search)) {
    const validFields = extractValidFields(search);
    for (const [field, value] of Object.entries(validFields)) {
      addRegexQuery(query, field, value);
    }
  }
}

function parseGenres(genres: string[] | string | undefined) {
  if (!genres) return [];

  if (typeof genres == "string") {
    genres = [genres];
  }
  return genres.map((genre) => {
    return genre.toLowerCase();
  });
}

function updateStockData(filteredRecords: any[], stockData: any[]): any[] {
  const updatedStockData: any[] = [];

  filteredRecords.forEach((record) => {
    const matchingStockItem = stockData.find((stockItem) => {
      return String(stockItem._id) === String(record.stock._id);
    });

    if (matchingStockItem) {
      updatedStockData.push(matchingStockItem);
    }
  });

  return updatedStockData;
}

function isPriceDefault(price: { min: number; max: number }): boolean {
  return (
    price.min === Number(DEFAULT_MIN_PRICE) &&
    price.max === Number(DEFAULT_MAX_PRICE)
  );
}

function filterGenreData(genreData: any[], parsedGenres: any[]): any[] {
  return genreData.filter((genre) =>
    parsedGenres.includes(genre.name.toLowerCase())
  );
}