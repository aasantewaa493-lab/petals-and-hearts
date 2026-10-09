import { addDays, format, isBefore, startOfDay } from "date-fns";

export type ZoneRule = {
  feePesewas: number;
  cutoffHour: number;
  leadDays: number;
  sameDay: boolean;
  dailyCapacity: number;
  reservedForDate?: number;
  blockedDates?: string[];
};

/** Accra is UTC year-round; treat the incoming Date as the business clock. */
export function isDeliveryDateAvailable(date: Date, zone: ZoneRule, now = new Date()) {
  const target = startOfDay(date);
  const today = startOfDay(now);
  if (isBefore(target, today)) return false;

  const iso = format(target, "yyyy-MM-dd");
  if (zone.blockedDates?.includes(iso)) return false;

  const reserved = zone.reservedForDate ?? 0;
  if (reserved >= zone.dailyCapacity) return false;

  const daysAhead = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (daysAhead === 0) {
    if (!zone.sameDay) return false;
    return now.getHours() < zone.cutoffHour;
  }
  return daysAhead >= zone.leadDays;
}

export function upcomingDeliveryDates(zone: ZoneRule, days = 14, now = new Date()) {
  return Array.from({ length: days }, (_, index) => addDays(startOfDay(now), index)).filter((date) =>
    isDeliveryDateAvailable(date, zone, now),
  );
}
