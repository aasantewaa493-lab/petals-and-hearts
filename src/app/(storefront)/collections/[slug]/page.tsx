import { notFound } from "next/navigation";
import { listCollections } from "@/server/catalog";
import { ProductGrid } from "@/components/products/product-grid";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collections = await listCollections();
  const match = collections.find((item) => item.slug === slug);
  if (!match) notFound();
  return <ProductGrid query={{ collection: slug }} title={match.name} />;
}
