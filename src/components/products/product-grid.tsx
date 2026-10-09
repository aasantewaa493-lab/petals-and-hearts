import { ProductCard } from "@/components/products/product-card";
import { searchCatalog, type CatalogQuery } from "@/server/catalog";
import Link from "next/link";

export async function ProductGrid({ query, title }: { query: CatalogQuery; title: string }) {
  const result = await searchCatalog(query);
  return (
    <section className="container-page py-10">
      <p className="text-sm text-muted">
        {result.total} {result.total === 1 ? "arrangement" : "arrangements"}
      </p>
      <h1 className="mt-1 font-serif text-4xl">{title}</h1>
      {result.products.length === 0 ? (
        <p className="mt-10 rounded-3xl border border-dashed border-line p-10 text-muted">
          Nothing matches these filters. Try a broader search or browse the full shop.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {result.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {result.pageCount > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: result.pageCount }, (_, index) => (
            <Link
              key={index}
              href={`?page=${index + 1}`}
              className={`rounded-full px-3 py-1 text-sm ${result.page === index + 1 ? "bg-brand text-white" : "border border-line"}`}
            >
              {index + 1}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
