import mongoose from "mongoose";
import Order, { OrderDocument } from "../models/Order";
import OrderList from "../models/OrderList";
import { OrderData } from "../types/OrderData";
import { findOrderListById, sanitizeOrder } from "../utils/ordersUtils";
import Record from "../models/Record";
import StockItem from "../models/StockItem";
import Store from "../models/Store";
import User from "../models/User";

async function getOrderList(orderListId: string) {
  try {
    const orderList = await OrderList.findById(orderListId);

    if (orderList) {
      const result = await Promise.all(
        orderList.orders.map(async (order: any) => {
          const foundOrder = await Order.findById(order);
          if (foundOrder) {
            const record = await Record.findById(foundOrder.record);
            const stockItem = await StockItem.findById(foundOrder.stockItem);
            const store = stockItem
              ? await Store.findById(stockItem.store)
              : null;
            return { record, stockItem, store };
          }
          return null;
        })
      );
      return { orderList, orders: result };
    }
    return null;
  } catch (error) {
    throw error;
  }
}

async function addOrderToOrderList(
  orderListId: string,
  orderData: OrderDocument
) {
  try {
    const orderList = await OrderList.findById(orderListId);
    if (!orderList) {
      throw new Error("Order list not found");
    }

    orderList.orders.push(orderData._id);

    await orderList.save();

    return sanitizeOrder(orderData);
  } catch (error) {
    throw error;
  }
}

async function deleteOrderFromOrderList(orderListId: string, orderId: string) {
  try {
    await findOrderListById(orderListId);

    const updatedOrderList = await OrderList.findOneAndUpdate(
      { _id: orderListId },
      { $pull: { orders: orderId } },
      { $new: true }
    );

    if (!updatedOrderList) {
      throw new Error("Order not present in the list");
    }

    return {
      status: "success",
      message: `Order ${orderId} deleted from Order list ${orderListId}`,
    };
  } catch (error) {
    throw error;
  }
}

async function updateOrderFromOrderList(
  orderListId: string,
  orderId: string,
  updatedOrderData: OrderData
) {
  try {
    const existingOrderList = await findOrderListById(orderListId);

    const existingOrders =
      existingOrderList.orders as mongoose.Types.ObjectId[];
    const orderIdAsObjectId = new mongoose.Types.ObjectId(orderId);

    const orderToUpdateIndex = existingOrders.findIndex((order) =>
      order.equals(orderIdAsObjectId)
    );

    if (orderToUpdateIndex === -1) {
      throw new Error("Order not found in order list");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updatedOrderData },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error("Failed to update order");
    }

    return sanitizeOrder(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order from order list");
  }
}

async function patchAndCreateOrderList(orderListId: string, userId: string) {
  try {
    const existingOrderList = await findOrderListById(orderListId);
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!existingOrderList) {
      throw new Error("Orderlist doesn't exist");
    }

    existingOrderList.paid = true;
    await existingOrderList.save();

    const newOrderList = new OrderList();
    await newOrderList.save();

    user.orderHistory.push(newOrderList._id);
    await user.save();

    return {
      paidOrderList: existingOrderList._id,
      newOrderList: newOrderList._id,
    };
  } catch (error) {
    console.error("Error patching and creating order list:", error);
    throw new Error("Failed to patch and create order list");
  }
}

export default {
  getOrderList,
  addOrderToOrderList,
  deleteOrderFromOrderList,
  updateOrderFromOrderList,
  patchAndCreateOrderList,
};
