import { describe, expect, it } from "vitest";
import { canTransition } from "@/lib/order-status";

describe("order status", () => {
  it("allows payment to processing", () => {
    expect(canTransition("PAID", "PROCESSING")).toBe(true);
  });

  it("blocks skipping dispatch", () => {
    expect(canTransition("PAID", "DELIVERED")).toBe(false);
  });

  it("blocks changes after refund", () => {
    expect(canTransition("REFUNDED", "PROCESSING")).toBe(false);
  });
});
