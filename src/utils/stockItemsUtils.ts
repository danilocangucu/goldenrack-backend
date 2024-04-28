export function validateStockItemBody(stockItem: any): void {
  const priceAsNumber = Number(stockItem.price);

  if (
    !stockItem ||
    typeof stockItem !== "object" ||
    !stockItem.condition ||
    typeof stockItem.condition !== "string" ||
    isNaN(priceAsNumber) ||
    priceAsNumber < 0 ||
    !stockItem.store ||
    typeof stockItem.store !== "string"
  ) {
    throw new Error(
      "Invalid stock item data: missing or incorrect condition, price, or store"
    );
  }
  console.log("finishing validateStockItemBody");
}
