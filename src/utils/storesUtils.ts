export function replaceCondition(
  populatedStockItem: any,
  populatedCondition: any
) {
  return { ...populatedStockItem._doc, condition: populatedCondition };
}
