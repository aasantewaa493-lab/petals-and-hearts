import { ProductGrid } from "@/components/products/product-grid";
import { ShopToolbar } from "@/components/products/shop-toolbar";

export const metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sort = typeof params.sort === "string" ? params.sort : "featured";
  const page = Number(params.page ?? 1);
  return (
    <>
      <ShopToolbar />
      <ProductGrid query={{ sort, page }} title="All flowers" />
    </>
  );
}
