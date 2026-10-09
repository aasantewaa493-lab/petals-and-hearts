import { bouquetBuilder, type BouquetSelection } from "@/config/bouquet";
import { clampMoney, multiplyMoney, percentOf } from "@/lib/money";

export type PricingLine = {
  unitPesewas: number;
  quantity: number;
};

export type PromotionInput = {
  type: "PERCENT" | "FIXED";
  percentOff?: number | null;
  amountPesewas?: number | null;
  minSubtotal: number;
};

export type QuoteInput = {
  lines: PricingLine[];
  promotion?: PromotionInput | null;
  deliveryPesewas: number;
  taxBps?: number;
};

export type Quote = {
  subtotalPesewas: number;
  discountPesewas: number;
  deliveryPesewas: number;
  taxPesewas: number;
  totalPesewas: number;
};

export function lineTotal(line: PricingLine) {
  if (line.quantity < 1) return 0;
  return multiplyMoney(line.unitPesewas, line.quantity);
}

export function calculateDiscount(subtotalPesewas: number, promotion?: PromotionInput | null) {
  if (!promotion) return 0;
  if (subtotalPesewas < promotion.minSubtotal) return 0;
  if (promotion.type === "PERCENT") {
    return clampMoney(percentOf(subtotalPesewas, promotion.percentOff ?? 0));
  }
  return clampMoney(Math.min(promotion.amountPesewas ?? 0, subtotalPesewas));
}

export function calculateQuote(input: QuoteInput): Quote {
  const subtotalPesewas = input.lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const discountPesewas = calculateDiscount(subtotalPesewas, input.promotion);
  const taxable = clampMoney(subtotalPesewas - discountPesewas + input.deliveryPesewas);
  const taxPesewas = input.taxBps ? Math.round((taxable * input.taxBps) / 10000) : 0;
  return {
    subtotalPesewas,
    discountPesewas,
    deliveryPesewas: input.deliveryPesewas,
    taxPesewas,
    totalPesewas: taxable + taxPesewas,
  };
}

export function calculateBouquetPrice(selection: BouquetSelection) {
  const size = bouquetBuilder.sizes.find((item) => item.id === selection.size);
  if (!size) throw new Error("Choose a bouquet size.");
  if (selection.flowers.length < 1) throw new Error("Choose at least one flower variety.");
  const flowerTotal = selection.flowers.reduce((sum, id) => {
    const flower = bouquetBuilder.flowers.find((item) => item.id === id);
    return sum + (flower?.pricePesewas ?? 0);
  }, 0);
  const wrap = bouquetBuilder.wraps.find((item) => item.id === selection.wrap);
  const wrapPrice = wrap?.pricePesewas ?? 0;
  const greenery = selection.greenery ? bouquetBuilder.greeneryPesewas : 0;
  const card = selection.card ? bouquetBuilder.cardPesewas : 0;
  return size.pricePesewas + flowerTotal + wrapPrice + greenery + card;
}

export function isValidCartQuantity(quantity: number, stock: number, max = 20) {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= Math.min(max, Math.max(stock, 0));
}
