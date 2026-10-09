import { ProductGrid } from "@/components/products/product-grid";

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  return <ProductGrid query={{ q }} title={q ? `Results for “${q}”` : "Search"} />;
}
