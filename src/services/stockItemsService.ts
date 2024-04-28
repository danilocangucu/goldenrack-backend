import Condition from "../models/Condition";
import Record from "../models/Record";
import Stock from "../models/Stock";
import StockItem from "../models/StockItem";
import Store from "../models/Store";

async function updateStockItem(
  stockItemId: string,
  conditionId: string,
  price: number
) {
  try {
    const foundStockItem = await StockItem.findById(stockItemId);
    if (!foundStockItem) {
      throw new Error("Stock item not found");
    }

    const foundCondition = await Condition.findById(conditionId);
    if (!foundCondition) {
      throw new Error("Condition not found");
    }

    foundStockItem.condition = conditionId;
    foundStockItem.price = price;
    await foundStockItem.save();

    return foundStockItem;
  } catch (error) {
    throw error;
  }
}

async function createStockItem(
  recordId: string,
  storeId: string,
  conditionId: string,
  price: number
) {
  try {
    const foundRecord = await Record.findById(recordId);
    if (!foundRecord) {
      throw new Error("Record not found");
    }

    const foundCondition = await Condition.findById(conditionId);
    if (!foundCondition) {
      throw new Error("Condition not found");
    }

    const foundStock = await Stock.findById(foundRecord.stock);
    if (!foundStock) {
      throw new Error("Stock not found");
    }

    const foundStore = await Store.findById(storeId);
    if (!foundStore) {
      throw new Error("Stock not found");
    }

    const newStockItem = new StockItem({
      store: storeId,
      condition: conditionId,
      price,
    });

    foundStock.stockItems.push({ stockItem: newStockItem._id });
    const foundRecordInStore = foundStore.recordsInStock.find(
      (record: any) => record.record.toString() === recordId
    );
    if (!foundRecordInStore) {
      throw new Error("Record was not found in store");
    }
    foundStore.save();

    const createdStockItem = await newStockItem.save();
    const plainCreatedStockItem = createdStockItem.toObject();
    const plainFoundCondition = foundCondition.toObject();

    return { ...plainCreatedStockItem, condition: plainFoundCondition };
  } catch (error) {
    throw error;
  }
}

export default {
  updateStockItem,
  createStockItem,
};
