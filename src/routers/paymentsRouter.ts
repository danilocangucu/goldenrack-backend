import express from "express";
import { createPaymentIntentHandler } from "../controllers/paymentsController";
import { isRequestedUser } from "../middlewares/isRequestedUser";

const paymentsRouter = express.Router();

paymentsRouter.post(
  "/create-intent",
  isRequestedUser,
  createPaymentIntentHandler
);

export default paymentsRouter;
