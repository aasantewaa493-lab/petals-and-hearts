import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export const metadata = { title: "Products" };

export default async function AdminProducts() {
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-brand px-4 py-2 text-sm text-white">
          New product
        </Link>
      </div>
      <table className="mt-6 w-full text-left text-sm">
        <thead><tr className="text-muted"><th className="py-2">Name</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-line">
              <td className="py-3"><Link href={`/admin/products/${product.id}`}>{product.name}</Link></td>
              <td>{product.category.name}</td>
              <td>{formatMoney(product.pricePesewas)}</td>
              <td>{product.stockQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
