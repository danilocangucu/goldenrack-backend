import Condition from "../models/Condition";
import Record from "../models/Record";
import StockItem from "../models/StockItem";
import Store from "../models/Store";
import { replaceCondition } from "../utils/storesUtils";

async function getStoreById(orderListId: string) {
  try {
    const foundStore = await Store.findById(orderListId);

    if (!foundStore) {
      throw new Error("Store not found");
    }

    const populatedRecordsInStore = await populateRecordsInStore(
      foundStore!.recordsInStock
    );

    const plainStoreObject = foundStore.toObject();

    return {
      ...plainStoreObject,
      recordsInStock: populatedRecordsInStore,
    };
  } catch (error) {
    throw error;
  }
}

async function populateRecordsInStore(recordsInStore: any[]) {
  const populatedRecords = await Promise.all(
    recordsInStore.map(async (item) => {
      const populatedRecord = await Record.findById(item.record).exec();
      if (!populatedRecord) {
        throw new Error("Record not found");
      }

      const populatedStockItemsArray = await Promise.all(
        item.stockItems.map(async (stockItem: any) => {
          const populatedStockItem = await StockItem.findById(stockItem).exec();
          if (!populatedStockItem) {
            throw new Error("StockItem not found");
          }
          const populatedConditionInStock = await Condition.findById(
            populatedStockItem!.condition
          ).exec();
          if (!populatedConditionInStock) {
            throw new Error("Condition for stock item was not found");
          }

          return replaceCondition(
            populatedStockItem,
            populatedConditionInStock
          );
        })
      );

      return {
        record: populatedRecord,
        stockItems: populatedStockItemsArray,
      };
    })
  );
  return populatedRecords;
}

export default {
  getStoreById,
};
