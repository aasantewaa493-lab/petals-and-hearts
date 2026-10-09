import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { PriceDisplay } from "@/components/products/price-display";
import { addToCartAction, toggleWishlistFormAction } from "@/server/actions";

type CardProduct = {
  id: string;
  name: string;
  slug: string;
  pricePesewas: number;
  compareAtPesewas?: number | null;
  stockQuantity: number;
  images: { url: string; alt: string }[];
};

export function ProductCard({ product }: { product: CardProduct }) {
  const image = product.images[0];
  const available = product.stockQuantity > 0;
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-line bg-white p-4">
      <Link href={`/product/${product.slug}`} className="relative mb-4 block overflow-hidden rounded-2xl bg-lavender-pale">
        <div className="relative aspect-square">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">Photography coming soon</div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-medium leading-snug">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <PriceDisplay pricePesewas={product.pricePesewas} compareAtPesewas={product.compareAtPesewas} />
        <p className="text-xs text-muted">{available ? "Available for scheduled delivery" : "Temporarily unavailable"}</p>
        <div className="mt-auto flex gap-2 pt-3">
          <form action={addToCartAction} className="flex-1">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="quantity" value="1" />
            <button
              disabled={!available}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" />
              Add
            </button>
          </form>
          <form action={toggleWishlistFormAction}>
            <input type="hidden" name="productId" value={product.id} />
            <button
              aria-label={`Save ${product.name}`}
              className="rounded-full border border-line p-2 text-brand-deep hover:bg-lavender"
            >
              <Heart className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
