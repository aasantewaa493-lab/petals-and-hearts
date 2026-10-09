export type AnalyticsEvent =
  | { name: "product_viewed"; productId: string }
  | { name: "search_performed"; query: string }
  | { name: "category_viewed"; slug: string }
  | { name: "product_added_to_wishlist"; productId: string }
  | { name: "product_added_to_cart"; productId: string; quantity: number }
  | { name: "cart_updated" }
  | { name: "checkout_started" }
  | { name: "delivery_option_selected"; zone: string }
  | { name: "payment_initiated"; orderReference: string }
  | { name: "purchase_completed"; orderReference: string; totalPesewas: number }
  | { name: "newsletter_signup_completed" };

export function trackEvent(event: AnalyticsEvent) {
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event.name);
  }
}
