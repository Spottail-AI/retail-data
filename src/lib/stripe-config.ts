export const STRIPE_TIERS = {
  pro: {
    price_id: "price_1SuwpKRzLrbbDlJalQ61nxfK",
    product_id: "prod_TsiFKW716UOf4P",
    name: "Pro",
    price: 20,
    currency: "USD",
    interval: "month",
  },
} as const;

export type SubscriptionTier = "free" | "pro" | "enterprise";

export function getTierFromProductId(productId: string | null): SubscriptionTier {
  if (!productId) return "free";
  if (productId === STRIPE_TIERS.pro.product_id) return "pro";
  return "free";
}
