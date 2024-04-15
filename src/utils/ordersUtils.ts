import OrderList, { OrderListDocument } from "../models/OrderList";
import Record, { RecordDocument } from "../models/Record";
import { OrderData } from "../types/OrderData";

// TODO implement validation, now it's only a temporary code to run the app
export async function validateOrder(orderData: OrderData): Promise<boolean> {
  try {
    let recordId = "";

    if (typeof orderData.record === "string") {
      recordId = orderData.record;
    } else {
    }

    const record: RecordDocument | null = await Record.findById(recordId);

    if (!record) {
      throw new Error("Record not found");
    }

    const stockExists = record.stock.some((stockItem) => {
      if (typeof orderData.stock === "string") {
        return false;
      } else {
        return true;
      }
    });

    if (!stockExists) {
      throw new Error("The requested record does not exist in stock");
    }

    return true;
  } catch (error) {
    console.error("Error validating order sum:", error);
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
