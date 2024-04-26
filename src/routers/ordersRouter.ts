import express from "express";

import {
  addOrderToOrderListHandler,
  deleteOrderFromOrderListHandler,
  getOrderListHandler,
  patchAndCreateOrderListHandler,
  updateOrderFromOrderListHandler,
} from "../controllers/orderListController";

const ordersRouter = express.Router();

// TODO fix GET bug after logging out
ordersRouter.get("/:orderListId", getOrderListHandler);
ordersRouter.post("/:orderListId", addOrderToOrderListHandler);
ordersRouter.patch("/:orderListId", patchAndCreateOrderListHandler);
ordersRouter.delete(
  "/:orderListId/orders/:orderId",
  deleteOrderFromOrderListHandler
);
ordersRouter.put(
  "/:orderListId/orders/:orderId",
  updateOrderFromOrderListHandler
);

export default ordersRouter;
