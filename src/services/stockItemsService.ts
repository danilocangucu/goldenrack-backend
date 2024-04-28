import Condition from "../models/Condition";
import StockItem from "../models/StockItem";

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
  storeId: string,
  conditionId: string,
  price: number
) {
  try {
    const foundCondition = await Condition.findById(conditionId);
    if (!foundCondition) {
      throw new Error("Condition not found");
    }

    const newStockItem = new StockItem({
      store: storeId,
      condition: conditionId,
      price,
    });

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
