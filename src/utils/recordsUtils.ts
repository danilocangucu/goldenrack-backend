import { Request } from "express";

import Record from "../models/Record";
import { mapFields, populateField } from "./dbUtils";
import Stock from "../models/Stock";
import Store from "../models/Store";
import { SortPrice } from "../types/RecordData";
import StockItem from "../models/StockItem";

interface IStockItem {
  // TODO check properties according to StockItem schema
  name: string;
  price: number;
  condition: string;
}

const DEFAULT_LIMIT = process.env.DEFAULT_LIMIT_QUERY;
const DEFAULT_PAGE = process.env.DEFAULT_PAGE_QUERY;
const DEFAULT_SEARCH_ARTIST = process.env.DEFAULT_SEARCH_ARTIST_QUERY;
const DEFAULT_SEARCH_TITLE = process.env.DEFAULT_SEARCH_TITLE_QUERY;
const DEFAULT_GENRES = process.env.DEFAULT_GENRES_QUERY || undefined;
const DEFAULT_MIN_PRICE = process.env.DEFAULT_MIN_PRICE_QUERY;
const DEFAULT_MAX_PRICE = process.env.DEFAULT_MAX_PRICE_QUERY;
const DEFAULT_SORT_PRICE = process.env.DEFAULT_SORT_PRICE_QUERY;

export function parseRecordsQueryParams(req: Request) {
  const {
    limit = DEFAULT_LIMIT,
    page = DEFAULT_PAGE,
    artist = DEFAULT_SEARCH_ARTIST,
    title = DEFAULT_SEARCH_TITLE,
    genres = DEFAULT_GENRES,
    min = DEFAULT_MIN_PRICE,
    max = DEFAULT_MAX_PRICE,
    sortPrice = DEFAULT_SORT_PRICE,
  } = req.query;

  return {
    limit: Number(limit),
    page: Number(page),
    artist: artist as string,
    title: title as string,
    genres: genres === "undefined" ? undefined : (genres as string),
    min: Number(min),
    max: Number(max),
    sortPrice: sortPrice as SortPrice,
  };
}

// TODO refactoring for calling populateField & mapField
// TODO refactoring fetchAndPopulateRecords: optional parameters that will always come from parseRecordsQueryParams
export async function fetchAndPopulateRecords(
  query?: any,
  genres?: any,
  price?: any,
  pagination?: any,
  sortPrice?: SortPrice
): Promise<any> {
  const { limit, page } = pagination;

  const queryBuilder = Record.find(query);
  const queryRecords = await queryBuilder.exec();

  let filteredRecords = queryRecords;

  let stockDataBefore = await populateField(
    { fieldName: "stock" },
    filteredRecords,
    Record
  );

  let stockDataAfter = await populateField(
    { fieldName: "stockItem", unwind: "stockItems" },
    stockDataBefore,
    Stock
  );

  let mergedStockData = mergeStockData(stockDataBefore, stockDataAfter);

  if (!isPriceDefault(price)) {
    mergedStockData = filterRecordsByPrice(
      mergedStockData,
      price.min,
      price.max
    );
    filteredRecords = updateFilteredRecords(
      filteredRecords,
      "stock",
      mergedStockData
    );
  }

  mergedStockData = sortStockDataByPrice(mergedStockData, sortPrice!);
  filteredRecords = updateFilteredRecordsOrder(
    mergedStockData,
    filteredRecords
  );

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
    mergedStockData = updateStockData(filteredRecords, mergedStockData);
  }

  const { paginatedRecords, totalPages } = paginateRecords(
    filteredRecords,
    page,
    limit
  );

  filteredRecords = paginatedRecords;

  const conditionData = await Promise.all(
    mergedStockData.map(async (mergedStock: any) => {
      if (mergedStock.stockItems && Array.isArray(mergedStock.stockItems)) {
        const conditionData = await populateField(
          { fieldName: "condition", extraMatch: "_id" },
          mergedStock.stockItems,
          StockItem
        );
        return conditionData;
      }
      return null;
    })
  );

  const storeData = await Promise.all(
    mergedStockData.map(async (mergedStock: any) => {
      if (mergedStock.stockItems && Array.isArray(mergedStock.stockItems)) {
        const storeData = await populateField(
          { fieldName: "store", extraMatch: "_id" },
          mergedStock.stockItems,
          StockItem
        );
        return storeData;
      }
      return null;
    })
  );

  const shippingInfoInStore = await Promise.all(
    storeData.map(async (storesInRecord) => {
      const shippingInfoPromise = populateField(
        {
          fieldName: "shippingInfo",
          extraMatch: "_id",
        },
        storesInRecord!,
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
    mergedStockData,
    transformedStoreData,
    "stockItems",
    "store"
  );

  const populatedStocks = mapFields(
    transformedStockWithStores,
    conditionData.filter((item: any): item is any[] => item !== null),
    "stockItems",
    "condition"
  );

  const recordsWithGenres = mapFields(filteredRecords, genreData, "genre");

  const populatedRecords = mapFields(
    recordsWithGenres,
    populatedStocks,
    "stock"
  );

  return { records: populatedRecords, totalPages };
}

export async function fectchAndPopulateRecordById(id: string) {
  const foundRecord = await Record.findById(id);

  let stockDataBefore = await populateField(
    { fieldName: "stock" },
    [foundRecord],
    Record
  );

  let stockDataAfter = await populateField(
    { fieldName: "stockItem", unwind: "stockItems" },
    stockDataBefore,
    Stock
  );

  const genreData = await populateField(
    { fieldName: "genre" },
    [foundRecord]!,
    Record
  );

  let mergedStockData = mergeStockData(stockDataBefore, stockDataAfter);

  const conditionData = await Promise.all(
    mergedStockData.map(async (mergedStock: any) => {
      if (mergedStock.stockItems && Array.isArray(mergedStock.stockItems)) {
        const conditionData = await populateField(
          { fieldName: "condition", extraMatch: "_id" },
          mergedStock.stockItems,
          StockItem
        );
        return conditionData;
      }
      return null;
    })
  );

  const storeData = await Promise.all(
    mergedStockData.map(async (mergedStock: any) => {
      if (mergedStock.stockItems && Array.isArray(mergedStock.stockItems)) {
        const storeData = await populateField(
          { fieldName: "store", extraMatch: "_id" },
          mergedStock.stockItems,
          StockItem
        );
        return storeData;
      }
      return null;
    })
  );

  const shippingInfoInStore = await Promise.all(
    storeData.map(async (storesInRecord) => {
      const shippingInfoPromise = populateField(
        {
          fieldName: "shippingInfo",
          extraMatch: "_id",
        },
        storesInRecord!,
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
    mergedStockData,
    transformedStoreData,
    "stockItems",
    "store"
  );

  const populatedStocks = mapFields(
    transformedStockWithStores,
    conditionData.filter((item: any): item is any[] => item !== null),
    "stockItems",
    "condition"
  );

  const recordWithGenre = mapFields([foundRecord], genreData, "genre");

  const populatedRecord = mapFields(recordWithGenre, populatedStocks, "stock");

  return populatedRecord;
}

function filterRecordsByPrice(
  records: any[][],
  minPrice: number,
  maxPrice: number
): any[][] {
  const testResult = records.filter((record: any) =>
    record.stockItems.some(
      (stockItem: any) =>
        stockItem.price >= minPrice && stockItem.price <= maxPrice
    )
  );

  return testResult;
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
    return !!matchingItem;
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

// TODO handle errors while parsing

function filterGenreData(genreData: any[], parsedGenres: any[]): any[] {
  return genreData.filter((genre) =>
    parsedGenres.includes(genre.name.toLowerCase())
  );
}

function paginateRecords(records: any[], page: number, limit: number) {
  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(records.length / limit);
  const paginatedRecords = records.slice(offset, offset + limit);

  return {
    paginatedRecords,
    totalPages,
  };
}

function sortStockDataByPrice(stockData: any[], sortPrice: SortPrice): any[] {
  let sortedStockData = stockData.map((dataItem) => {
    if (dataItem.stockItems && Array.isArray(dataItem.stockItems)) {
      let sortedStockItems = dataItem.stockItems.sort((a: any, b: any) =>
        sortPrice === "asc" ? a.price - b.price : b.price - a.price
      );
      return { ...dataItem, stockItems: sortedStockItems };
    }
    return dataItem;
  });
  sortedStockData = sortedStockData.sort((a: any, b: any) =>
    sortPrice === "asc"
      ? a.stockItems[0].price - b.stockItems[0].price
      : b.stockItems[0].price - a.stockItems[0].price
  );
  return sortedStockData;
}

function updateFilteredRecordsOrder(
  sortedStockData: any[],
  filteredRecords: any[]
): any[] {
  const sortedRecords = sortedStockData
    .map((sortedRecord) => {
      return filteredRecords.find((filteredRecord) => {
        return String(filteredRecord.stock) === String(sortedRecord._id);
      });
    })
    .filter((record) => record !== undefined);

  return sortedRecords;
}

export function mergeStockData(
  stockDataBefore: any[],
  stockDataAfter: any[][]
): any[] {
  stockDataBefore.forEach((beforeItem, index) => {
    beforeItem.stockItems.forEach((stockItem: any, siIndex: number) => {
      if (stockDataAfter[index] && stockDataAfter[index][siIndex]) {
        beforeItem.stockItems[siIndex] = stockDataAfter[index][siIndex];
      }
    });
  });

  return stockDataBefore;
}

async function fetchStockItemsWithCondition() {
  try {
    // TODO error handling for queryResults
    const queryResults = await StockItem.find();
  } catch (err) {
    console.error(err);
  }
}

export function validateRecordBody(req: Request): void {
  if (
    !req.body.title ||
    !req.body.artist ||
    !req.body.genre ||
    !req.body.year ||
    !req.body.description
  ) {
    throw new Error(
      "Missing required fields: title, artist, genre, year, and description"
    );
  }

  if (
    isNaN(parseInt(req.body.year)) ||
    parseInt(req.body.year) < 1900 ||
    parseInt(req.body.year) > new Date().getFullYear()
  ) {
    throw new Error("Invalid year provided");
  }

  console.log("year parsed");

  if (req.body.description.length < 10 || req.body.description.length > 500) {
    throw new Error(
      "Invalid description: must be between 10 and 500 characters"
    );
  }

  if (!req.body.genre.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error("Invalid genre identifier");
  }
}