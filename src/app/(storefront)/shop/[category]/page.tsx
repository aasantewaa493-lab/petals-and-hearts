import { notFound } from "next/navigation";
import { listCategories } from "@/server/catalog";
import { ProductGrid } from "@/components/products/product-grid";
import { ShopToolbar } from "@/components/products/shop-toolbar";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categories = await listCategories();
  const match = categories.find((item) => item.slug === category);
  return { title: match?.name ?? "Shop" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ category }, query] = await Promise.all([params, searchParams]);
  const categories = await listCategories();
  const match = categories.find((item) => item.slug === category);
  if (!match) notFound();
  return (
    <>
      <ShopToolbar />
      <ProductGrid
        query={{ category, sort: typeof query.sort === "string" ? query.sort : "featured", page: Number(query.page ?? 1) }}
        title={match.name}
      />
    </>
  );
}
