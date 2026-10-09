import type { PaymentProvider } from "@/lib/payments/types";
import { getEnv } from "@/lib/env";

const store = new Map<
  string,
  { amountPesewas: number; currency: string; status: "PENDING" | "SUCCEEDED" | "FAILED" }
>();

export const mockProvider: PaymentProvider = {
  name: "mock",
  async initialize(input) {
    store.set(input.reference, {
      amountPesewas: input.amountPesewas,
      currency: input.currency,
      status: "PENDING",
    });
    const url = new URL("/checkout/mock-pay", getEnv().siteUrl);
    url.searchParams.set("reference", input.reference);
    return { authorizationUrl: url.toString(), providerReference: input.reference };
  },
  async verify(reference) {
    const record = store.get(reference);
    if (!record) {
      return {
        success: false,
        providerReference: reference,
        amountPesewas: 0,
        currency: "GHS",
        status: "FAILED",
      };
    }
    return {
      success: record.status === "SUCCEEDED",
      providerReference: reference,
      amountPesewas: record.amountPesewas,
      currency: record.currency,
      status: record.status,
    };
  },
};

export function settleMockPayment(reference: string, status: "SUCCEEDED" | "FAILED") {
  const record = store.get(reference);
  if (!record) return false;
  record.status = status;
  store.set(reference, record);
  return true;
}
