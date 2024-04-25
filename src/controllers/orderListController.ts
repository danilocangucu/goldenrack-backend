import { Request, Response } from "express";
import orderListService from "../services/orderListService";
import { validateOrder } from "../utils/ordersUtils";
import OrderList from "../models/OrderList";
import { OrderDocument } from "../models/Order";

export async function getOrderListHandler(req: Request, res: Response) {
  try {
    const { orderListId } = req.params;
    const orderList = await orderListService.getOrderList(orderListId);
    res.status(200).json({
      data: orderList,
      status: "success",
      message: "Order list fetched with success",
    });
  } catch (error) {
    console.error("Error retrieving order list:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

export async function addOrderToOrderListHandler(req: Request, res: Response) {
  try {
    const { orderListId } = req.params;

    const orderList = await OrderList.findById(orderListId);

    if (!orderList) {
      throw new Error("Order list not found");
    }

    const orderData = req.body;

    // TODO rename/refactor isValidOrderSum
    const isValidOrderSum = await validateOrder(orderData);
    if (!isValidOrderSum) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid order" });
    }

    const newOrder = await orderListService.addOrderToOrderList(
      orderListId,
      isValidOrderSum as OrderDocument
    );
    res.status(201).json({
      status: "success",
      data: newOrder,
      message: "Order added to Order list",
    });
  } catch (error) {
    console.error("Error adding order to order list:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

export async function deleteOrderFromOrderListHandler(
  req: Request,
  res: Response
) {
  try {
    const { orderListId, orderId } = req.params;
    const response = await orderListService.deleteOrderFromOrderList(
      orderListId,
      orderId
    );

    if (response.status === "success") {
      res.status(200).json({
        status: response.status,
        message: response.message,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: `The order ${orderId} was not deleted from ${orderListId}.`,
      });
    }
  } catch (error) {
    console.error("Error deleting order from order list:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

export async function updateOrderFromOrderListHandler(
  req: Request,
  res: Response
) {
  try {
    const { orderListId, orderId } = req.params;
    const updatedOrderData = req.body;
    const updatedOrder = await orderListService.updateOrderFromOrderList(
      orderListId,
      orderId,
      updatedOrderData
    );
    res.status(200).json({
      status: "success",
      data: updatedOrder,
      message: `Order ${orderId} updated from Order list ${orderListId}.`,
    });
  } catch (error) {
    console.error("Error updating order in order list:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
