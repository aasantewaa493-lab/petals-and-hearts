import { brand } from "@/config/brand";

/** All store money is stored as integer minor units (Ghana pesewas). */
export type Money = number;

export function pesewas(cedis: number): Money {
  return Math.round(cedis * 100);
}

export function formatMoney(
  amountPesewas: number,
  currency: string = brand.currency,
) {
  const major = (amountPesewas / 100).toFixed(2);
  if (currency === "GHS") return `GH₵${major}`;
  return `${currency} ${major}`;
}

export function addMoney(...amounts: number[]) {
  return amounts.reduce((sum, value) => sum + value, 0);
}

export function multiplyMoney(amountPesewas: number, quantity: number) {
  return amountPesewas * quantity;
}

export function percentOf(amountPesewas: number, percent: number) {
  if (percent <= 0) return 0;
  return Math.round((amountPesewas * percent) / 100);
}

export function clampMoney(amountPesewas: number) {
  return Math.max(0, amountPesewas);
}
