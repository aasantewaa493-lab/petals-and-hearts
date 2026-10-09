import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";
import { ProductCard } from "@/components/products/product-card";

export const metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const user = await getSessionUser();
  const wishlist = user?.id
    ? await prisma.wishlist.findFirst({
        where: { userId: user.id },
        include: { items: { include: { product: { include: { images: true } } } } },
      })
    : null;
  const products = wishlist?.items.map((item) => item.product) ?? [];
  return (
    <div className="container-page py-12">
      <h1 className="font-serif text-4xl">Saved arrangements</h1>
      {products.length === 0 ? (
        <p className="mt-6 text-muted">Sign in and save pieces you want to revisit. Guest saves are limited to the current session wishlist once an account exists.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
