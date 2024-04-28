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
    await foundStock.save();

    const foundRecordInStore = foundStore.recordsInStock.find(
      (record: any) => record.record.toString() === recordId
    );
    if (!foundRecordInStore) {
      throw new Error("Record was not found in store");
    }
    foundRecordInStore.stockItems.push(newStockItem._id);
    foundStore.save();

    const createdStockItem = await newStockItem.save();
    const plainCreatedStockItem = createdStockItem.toObject();
    const plainFoundCondition = foundCondition.toObject();

    return { ...plainCreatedStockItem, condition: plainFoundCondition };
  } catch (error) {
    throw error;
  }
}

async function deleteStockItem(
  stockItemId: string,
  storeId: string,
  recordId: string
): Promise<boolean> {
  const foundStore = await Store.findById(storeId);

  if (!foundStore) {
    return false;
  }

  const foundRecord = await Record.findById(recordId);
  if (!foundRecord) {
    return false;
  }

  const recordIndex = foundStore.recordsInStock.findIndex(
    (recordAndStock) => recordAndStock.record.toString() === recordId
  );

  if (recordIndex === -1) {
    console.error("Record not found in store");
    return false;
  }

  const stockItems = foundStore?.recordsInStock[recordIndex!].stockItems.filter(
    (stockItemIdInRecord: any) => stockItemIdInRecord.toString() !== stockItemId
  );

  const stockItemsFiltered = stockItems || [];
  foundStore.recordsInStock[recordIndex!].stockItems = stockItemsFiltered;

  await foundStore.save();

  const foundStock = await Stock.findById(foundRecord.stock);
  if (!foundStock) {
    return false;
  }

  const filteredStock = foundStock.stockItems.filter(
    (stockItem: any) => stockItem.stockItem.toString() !== stockItemId
  );

  foundStock.stockItems = filteredStock;
  await foundStock.save();

  const result = await StockItem.findByIdAndDelete(stockItemId);

  return result != null;
}

export default {
  updateStockItem,
  createStockItem,
  deleteStockItem,
};
