import { Request, Response } from "express";
import paymentsService from "../services/paymentsService";

export async function createPaymentIntentHandler(req: Request, res: Response) {
  try {
    const { orderSum } = req.body;

    if (!orderSum) {
      throw new Error("Order sum is required");
    }

    const validatedOrderSum = paymentsService.validateOrderSum(orderSum);

    const clientSecret = await paymentsService.createPaymentIntent(
      validatedOrderSum
    );

    res.json({ clientSecret });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in createPaymentIntentHandler:", error);
      res.status(400).json({ error: error.message });
    } else {
      console.error("Unknown error in createPaymentIntentHandler:", error);
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
}
