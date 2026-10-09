import Image from "next/image";
import Link from "next/link";
import { featuredProducts, listCategories, listOccasions, getStoreContent } from "@/server/catalog";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";

export default async function HomePage() {
  const [products, categories, occasions, content] = await Promise.all([
    featuredProducts(),
    listCategories(),
    listOccasions(),
    getStoreContent(),
  ]);
  const hero = (content.hero ?? {}) as Record<string, string>;
  const story = typeof content.story === "string" ? content.story : brand.description;

  return (
    <div>
      <section className="container-page mt-4 overflow-hidden rounded-[2rem] bg-[#f7e8ee]">
        <div className="grid items-center gap-8 px-6 py-12 md:grid-cols-2 md:px-12 md:py-16">
          <div className="max-w-md space-y-5">
            <p className="text-sm uppercase tracking-[0.2em] text-brand">{hero.eyebrow ?? "Seasonal atelier"}</p>
            <h1 className="font-serif text-5xl leading-tight text-brand-deep md:text-6xl">
              {hero.title ?? brand.tagline}
            </h1>
            <p className="text-lg text-muted">
              {hero.subtitle ?? "Thoughtfully arranged blooms for the moments that matter most."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={hero.ctaHref ?? "/shop/bouquets"}>{hero.ctaLabel ?? "Shop bouquets"}</Button>
              <Button href={hero.secondaryHref ?? "/collections"} variant="secondary">
                {hero.secondaryLabel ?? "Explore collections"}
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <Image
              src={hero.image ?? "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1600&q=80"}
              alt="Seasonal blush tulips"
              fill
              priority
              className="object-contain object-right"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="container-page mt-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm text-brand">Browse</p>
            <h2 className="font-serif text-4xl">Shop by category</h2>
          </div>
          <Button href="/shop" variant="ghost">
            All flowers
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/${category.slug}`}
              className="overflow-hidden rounded-3xl border border-line bg-white"
            >
              <div className="relative aspect-[4/3] bg-lavender-pale">
                {category.imageUrl && (
                  <Image src={category.imageUrl} alt={category.name} fill className="object-cover" sizes="33vw" />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-serif text-2xl">{category.name}</h3>
                <p className="mt-1 text-sm text-muted">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-16">
        <h2 className="mb-6 font-serif text-4xl">Bestsellers</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-page mt-16">
        <h2 className="mb-6 font-serif text-4xl">Shop by occasion</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((occasion) => (
            <Link key={occasion.id} href={`/occasions/${occasion.slug}`} className="group overflow-hidden rounded-3xl">
              <div className="relative aspect-[3/4]">
                {occasion.imageUrl && (
                  <Image src={occasion.imageUrl} alt={occasion.name} fill className="object-cover transition group-hover:scale-105" sizes="25vw" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <p className="absolute bottom-4 left-4 font-serif text-2xl text-white">{occasion.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-16 grid items-center gap-8 rounded-[2rem] bg-lavender-pale p-8 md:grid-cols-2 md:p-12">
        <div>
          <p className="text-sm text-brand">The atelier</p>
          <h2 className="mt-2 font-serif text-4xl">A bouquet, composed for someone.</h2>
          <p className="mt-4 text-muted">
            Choose size, stems, palette, and wrap. The price updates from those options — nothing is added until you review it.
          </p>
          <div className="mt-6">
            <Button href="/custom-bouquet">Start a custom bouquet</Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1400&q=80"
            alt="Hands wrapping a seasonal bouquet"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
      </section>

      <section className="container-page mt-16 grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-line bg-white p-8">
          <h2 className="font-serif text-3xl">The studio</h2>
          <p className="mt-4 leading-7 text-muted">{story}</p>
        </div>
        <div className="rounded-3xl bg-brand-deep p-8 text-white">
          <h2 className="font-serif text-3xl">How we work</h2>
          <ul className="mt-4 space-y-3 text-sm/6 text-white/85">
            <li>Secure payment through the configured provider.</li>
            <li>Delivery dates are reserved against real zone capacity.</li>
            <li>Gift messages are written by the studio, not generated as social proof.</li>
            <li>Support replies use the configured contact email once it is supplied.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
