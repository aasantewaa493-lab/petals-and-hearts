import { prisma } from "@/lib/db";
import { adminAdjustStockAction } from "@/server/actions";

export default async function Page() {
  const products = await prisma.product.findMany({ include: { inventory: true }, orderBy: { stockQuantity: "asc" } });
  return (
    <div>
      <h1 className="font-serif text-4xl">Inventory</h1>
      <ul className="mt-6 space-y-3">
        {products.map((product) => (
          <li key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
            <span>{product.name} · {product.stockQuantity} in stock</span>
            <form action={adminAdjustStockAction} className="flex gap-2">
              <input type="hidden" name="productId" value={product.id} />
              <input name="delta" type="number" defaultValue={1} className="w-20 rounded-xl border border-line px-2" />
              <input name="note" placeholder="Note" className="rounded-xl border border-line px-2" />
              <button className="rounded-full bg-brand px-3 text-sm text-white">Adjust</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
