import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

function validateOrderSum(orderSum: any): number {
  const numericOrderSum = Number(orderSum);
  if (isNaN(numericOrderSum) || numericOrderSum <= 0) {
    throw new Error("Order sum must be a positive number");
  }

  const minimumOrderAmount = 10.0;
  if (numericOrderSum < minimumOrderAmount) {
    throw new Error(`Order sum must be at least ${minimumOrderAmount}`);
  }

  return numericOrderSum;
}

async function createPaymentIntent(validatedOrderSum: number) {
  const amountInSmallestUnit = validatedOrderSum * 100;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: "eur",
    });
    return paymentIntent.client_secret;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
}

export default {
  validateOrderSum,
  createPaymentIntent,
};
