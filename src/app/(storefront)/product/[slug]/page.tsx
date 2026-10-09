import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, relatedProducts } from "@/server/catalog";
import { formatMoney } from "@/lib/money";
import { asStringArray } from "@/lib/utils";
import { addToCartAction, reviewAction } from "@/server/actions";
import { ProductCard } from "@/components/products/product-card";
import { PriceDisplay } from "@/components/products/price-display";
import { brand } from "@/config/brand";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name, description: product?.shortDescription };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await relatedProducts(product.id, product.categoryId);
  const published = product.reviews;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((image) => image.url),
    offers: {
      "@type": "Offer",
      priceCurrency: brand.currency,
      price: (product.pricePesewas / 100).toFixed(2),
      availability: product.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <article className="container-page py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-lavender-pale">
            {product.images[0] && (
              <Image src={product.images[0].url} alt={product.images[0].alt} fill priority className="object-cover" sizes="50vw" />
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image) => (
              <div key={image.id} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="15vw" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-brand">{product.category.name}</p>
          <h1 className="mt-2 font-serif text-5xl">{product.name}</h1>
          <div className="mt-4">
            <PriceDisplay pricePesewas={product.pricePesewas} compareAtPesewas={product.compareAtPesewas} />
          </div>
          <p className="mt-4 text-muted">{product.shortDescription}</p>
          <p className="mt-2 text-sm text-muted">{product.description}</p>
          <p className="mt-4 text-sm">
            {product.stockQuantity > 0
              ? `${product.stockQuantity} available · ${product.availability.replaceAll("_", " ").toLowerCase()}`
              : "Currently unavailable"}
          </p>
          <form action={addToCartAction} className="mt-6 space-y-4 rounded-3xl border border-line bg-white p-5">
            <input type="hidden" name="productId" value={product.id} />
            {product.variants.length > 0 && (
              <label className="block text-sm">
                Size / presentation
                <select name="variantId" className="mt-1 w-full rounded-2xl border border-line px-3 py-2">
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name}
                      {variant.pricePesewas ? ` · ${formatMoney(variant.pricePesewas)}` : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="block text-sm">
              Quantity
              <input name="quantity" type="number" min={1} max={product.stockQuantity} defaultValue={1} className="mt-1 w-24 rounded-2xl border border-line px-3 py-2" />
            </label>
            <label className="block text-sm">
              Recipient name
              <input name="recipientName" className="mt-1 w-full rounded-2xl border border-line px-3 py-2" />
            </label>
            <label className="block text-sm">
              Gift message
              <textarea name="giftMessage" rows={3} className="mt-1 w-full rounded-2xl border border-line px-3 py-2" />
            </label>
            <button className="w-full rounded-full bg-brand py-3 font-semibold text-white" disabled={product.stockQuantity < 1}>
              Add to bag
            </button>
          </form>
          <dl className="mt-8 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">Stems</dt>
              <dd className="text-muted">{asStringArray(product.flowerVarieties).join(", ") || "Seasonal mix"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Care</dt>
              <dd className="text-muted">{product.careInstructions}</dd>
            </div>
            <div>
              <dt className="font-semibold">Substitution</dt>
              <dd className="text-muted">{brand.delivery.substitutionPolicy}</dd>
            </div>
          </dl>
        </div>
      </div>

      {published.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">Reviews</h2>
          <ul className="mt-4 space-y-4">
            {published.map((review) => (
              <li key={review.id} className="rounded-2xl border border-line p-4">
                <p className="font-medium">{review.displayName}</p>
                <p className="text-sm text-brand">{"★".repeat(review.rating)}</p>
                <p className="mt-2 text-sm text-muted">{review.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12 rounded-3xl bg-lavender-pale p-6">
        <h2 className="font-serif text-2xl">Write a review</h2>
        <p className="text-sm text-muted">Reviews stay pending until a staff member publishes them. Verified purchase is marked only after a paid order.</p>
        <form action={reviewAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input type="hidden" name="productId" value={product.id} />
          <input name="displayName" placeholder="Display name" className="rounded-2xl border border-line px-3 py-2" />
          <input name="rating" type="number" min={1} max={5} placeholder="Rating 1–5" className="rounded-2xl border border-line px-3 py-2" />
          <textarea name="body" placeholder="Your notes" className="rounded-2xl border border-line px-3 py-2 md:col-span-2" />
          <button className="rounded-full bg-brand px-5 py-2 text-white">Submit for moderation</button>
        </form>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-3xl">You may also like</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
