import { describe, expect, it } from "vitest";
import { calculateBouquetPrice, calculateDiscount, calculateQuote, isValidCartQuantity } from "@/lib/pricing";

describe("pricing", () => {
  it("applies a percent discount only above the minimum", () => {
    expect(calculateDiscount(15000, { type: "PERCENT", percentOff: 10, minSubtotal: 20000 })).toBe(0);
    expect(calculateDiscount(20000, { type: "PERCENT", percentOff: 10, minSubtotal: 20000 })).toBe(2000);
  });

  it("never discounts below zero", () => {
    expect(calculateDiscount(5000, { type: "FIXED", amountPesewas: 9000, minSubtotal: 0 })).toBe(5000);
  });

  it("quotes totals with integer money", () => {
    const quote = calculateQuote({
      lines: [{ unitPesewas: 32000, quantity: 2 }],
      promotion: { type: "PERCENT", percentOff: 10, minSubtotal: 0 },
      deliveryPesewas: 4000,
    });
    expect(quote.subtotalPesewas).toBe(64000);
    expect(quote.discountPesewas).toBe(6400);
    expect(quote.totalPesewas).toBe(61600);
  });

  it("prices a custom bouquet from selected options", () => {
    const price = calculateBouquetPrice({
      size: "luxe",
      flowers: ["rose", "tulip"],
      palette: "blush",
      greenery: true,
      wrap: "linen",
      card: true,
      message: "For you",
      recipientName: "Ama",
    });
    expect(price).toBe(48000 + 4000 + 2000 + 2500 + 1500);
  });

  it("rejects invalid cart quantities", () => {
    expect(isValidCartQuantity(0, 5)).toBe(false);
    expect(isValidCartQuantity(3, 2)).toBe(false);
    expect(isValidCartQuantity(2, 5)).toBe(true);
  });
});
