// Fulfillment data - stub until Shopify hosted checkout handles this
// Shopify hosted checkout manages shipping methods directly
export async function listCartShippingMethods(_cartId: string) {
  return null
}

export async function calculatePriceForShippingOption(_optionId: string, _cartId: string) {
  return { id: _optionId, amount: 0 }
}
