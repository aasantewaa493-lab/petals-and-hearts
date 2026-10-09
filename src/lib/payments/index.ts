import { getEnv } from "@/lib/env";
import { mockProvider } from "@/lib/payments/mock";
import { paystackProvider } from "@/lib/payments/paystack";
import type { PaymentProvider } from "@/lib/payments/types";

export function getPaymentProvider(): PaymentProvider {
  const env = getEnv();
  if (env.paymentProvider === "paystack") {
    if (process.env.NODE_ENV === "production" && !env.paystackSecretKey) {
      throw new Error("Production payments require PAYSTACK_SECRET_KEY.");
    }
    if (env.paystackSecretKey) return paystackProvider;
  }
  return mockProvider;
}
