import { formatMoney } from "@/lib/money";

export function PriceDisplay({
  pricePesewas,
  compareAtPesewas,
}: {
  pricePesewas: number;
  compareAtPesewas?: number | null;
}) {
  const onSale = Boolean(compareAtPesewas && compareAtPesewas > pricePesewas);
  return (
    <p className="flex items-baseline gap-2 font-medium">
      <span>{formatMoney(pricePesewas)}</span>
      {onSale && (
        <span className="text-sm text-muted line-through">{formatMoney(compareAtPesewas!)}</span>
      )}
    </p>
  );
}
