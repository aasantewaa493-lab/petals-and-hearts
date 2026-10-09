import { NextResponse } from "next/server";
import { searchCatalog } from "@/server/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ products: [] });
  }
  const result = await searchCatalog({ q, pageSize: 6 });
  return NextResponse.json({
    products: result.products.map((product) => ({
      name: product.name,
      slug: product.slug,
      pricePesewas: product.pricePesewas,
      image: product.images[0]?.url ?? "",
    })),
  });
}
