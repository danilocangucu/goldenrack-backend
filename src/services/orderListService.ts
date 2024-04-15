import mongoose from "mongoose";
import Order from "../models/Order";
import OrderList from "../models/OrderList";
import { OrderData } from "../types/OrderData";
import {
  findOrderListById,
  sanitizeOrder,
  sanitizeOrderList,
} from "../utils/ordersUtils";

async function getOrderList(orderListId: string) {
  try {
    const orderList = await OrderList.findById(orderListId).populate({
      path: "orders",
      populate: {
        path: "carId",
        populate: [
          { path: "brand", select: { _id: 0 } },
          { path: "conditions", select: { _id: 0 } },
        ],
        select: { _id: 0, __v: 0 },
      },
    });

    if (orderList) {
      return sanitizeOrderList(orderList);
    }
    return null;
  } catch (error) {
    throw error;
  }
}

async function addOrderToOrderList(orderListId: string, orderData: OrderData) {
  try {
    const orderList = await OrderList.findById(orderListId);
    if (!orderList) {
      throw new Error("Order list not found");
    }

    const order = new Order(orderData);
    await order.save();

    orderList.orders.push(order._id);

    await orderList.save();

    return sanitizeOrder(order);
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

export default {
  getOrderList,
  addOrderToOrderList,
  deleteOrderFromOrderList,
  updateOrderFromOrderList,
};
