import Order from "../models/Order";
import OrderList, { OrderListDocument } from "../models/OrderList";
import { OrderDocument } from "../models/Order";
import Record from "../models/Record";
import Stock from "../models/Stock";
import { OrderData } from "../types/OrderData";
import { populateField } from "./dbUtils";
import { mergeStockData } from "./recordsUtils";

// TODO implement validation, now it's only a temporary code to run the app
export async function validateOrder(
  orderData: OrderData
): Promise<OrderDocument | boolean> {
  try {
    const foundRecord = await Record.findById(orderData.record);
    if (!foundRecord) {
      return false;
    }

    const stock = await Stock.findById(orderData.stock);

    if (!stock) {
      return false;
    }

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

    let mergedStockData = mergeStockData(stockDataBefore, stockDataAfter);
    let price = 0;

    if (Array.isArray(mergedStockData)) {
      const [isStockItem] = mergedStockData.map((stockItem) => {
        if (stockItem.stockItems) {
          if (Array.isArray(stockItem.stockItems)) {
            return stockItem.stockItems.map((item: any) => {
              if (item._id.toString() === orderData.stockItem) {
                price = item.price;
                return true;
              } else {
                return false;
              }
            });
          } else {
            return [];
          }
        }
      });

      if (!isStockItem.includes(true)) {
        return false;
      }
    }

    const newOrder = new Order({
      record: orderData.record,
      stockItem: orderData.stockItem,
      price,
    });

    return await newOrder.save();
  } catch (error) {
    console.error("Error validating order:", error);
    return false;
  }
}

export async function findOrderListById(
  orderListId: string
): Promise<OrderListDocument> {
  const orderList = await OrderList.findById(orderListId);
  if (!orderList) {
    throw new Error("Order list not found");
  }
  return orderList;
}

export function sanitizeOrderList(orderList: OrderListDocument): any {
  const orders = orderList.orders || [];

  const sanitizedOrders = orders.map((order: any) => sanitizeOrder(order));

  return { id: orderList._id, orders: sanitizedOrders };
}

export function sanitizeOrder(order: any): any {
  const { _id, __v, ...sanitizedOrder } = order.toObject();
  return {
    id: _id,
    stock: sanitizedOrder.carId,
    quantity: sanitizedOrder.quantity,
    orderSum: sanitizedOrder.orderSum,
  };
}
