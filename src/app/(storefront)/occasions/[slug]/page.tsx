import { notFound } from "next/navigation";
import { listOccasions } from "@/server/catalog";
import { ProductGrid } from "@/components/products/product-grid";

export default async function OccasionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const occasions = await listOccasions();
  const match = occasions.find((item) => item.slug === slug);
  if (!match) notFound();
  return <ProductGrid query={{ occasion: slug }} title={match.name} />;
}
