import { describe, expect, it } from "vitest";
import { isDeliveryDateAvailable } from "@/lib/delivery";

const zone = {
  feePesewas: 4000,
  cutoffHour: 13,
  leadDays: 1,
  sameDay: true,
  dailyCapacity: 2,
};

describe("delivery", () => {
  it("rejects dates in the past", () => {
    const now = new Date("2026-10-08T10:00:00");
    expect(isDeliveryDateAvailable(new Date("2026-10-07"), zone, now)).toBe(false);
  });

  it("allows same-day before cutoff when enabled", () => {
    const now = new Date("2026-10-08T10:00:00");
    expect(isDeliveryDateAvailable(new Date("2026-10-08"), zone, now)).toBe(true);
  });

  it("rejects a full day", () => {
    const now = new Date("2026-10-08T10:00:00");
    expect(isDeliveryDateAvailable(new Date("2026-10-09"), { ...zone, reservedForDate: 2 }, now)).toBe(false);
  });
});
