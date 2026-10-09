import { prisma } from "@/lib/db";
import { asStringArray } from "@/lib/utils";

const productInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  category: true,
  variants: { where: { isActive: true } },
  collections: { include: { collection: true } },
  occasions: { include: { occasion: true } },
  reviews: { where: { status: "PUBLISHED" as const } },
};

export type CatalogQuery = {
  category?: string;
  collection?: string;
  occasion?: string;
  q?: string;
  color?: string;
  flower?: string;
  availability?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export async function listCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function listCollections() {
  return prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: { products: { include: { product: { include: { images: true } } } } },
  });
}

export async function listOccasions() {
  return prisma.occasion.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: productInclude,
  });
}

export async function searchCatalog(query: CatalogQuery) {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(24, query.pageSize ?? 12);
  const where = {
    isActive: true,
    ...(query.category ? { category: { slug: query.category } } : {}),
    ...(query.collection ? { collections: { some: { collection: { slug: query.collection } } } } : {}),
    ...(query.occasion ? { occasions: { some: { occasion: { slug: query.occasion } } } } : {}),
    ...(query.availability ? { availability: query.availability as never } : {}),
    ...(query.minPrice || query.maxPrice
      ? {
          pricePesewas: {
            gte: query.minPrice ?? 0,
            lte: query.maxPrice ?? 10_000_000,
          },
        }
      : {}),
    ...(query.q
      ? {
          OR: [
            { name: { contains: query.q } },
            { shortDescription: { contains: query.q } },
            { description: { contains: query.q } },
          ],
        }
      : {}),
  };

  const orderBy =
    query.sort === "price-asc"
      ? { pricePesewas: "asc" as const }
      : query.sort === "price-desc"
        ? { pricePesewas: "desc" as const }
        : query.sort === "newest"
          ? { createdAt: "desc" as const }
          : [{ isFeatured: "desc" as const }, { isBestseller: "desc" as const }, { createdAt: "desc" as const }];

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const filtered = products.filter((product) => {
    const colors = asStringArray(product.colors);
    const flowers = asStringArray(product.flowerVarieties);
    if (query.color && !colors.includes(query.color)) return false;
    if (query.flower && !flowers.includes(query.flower)) return false;
    return true;
  });

  return {
    products: filtered,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function relatedProducts(productId: string, categoryId: string) {
  return prisma.product.findMany({
    where: { isActive: true, id: { not: productId }, categoryId },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    take: 4,
  });
}

export async function featuredProducts() {
  return prisma.product.findMany({
    where: { isActive: true, OR: [{ isFeatured: true }, { isBestseller: true }] },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    take: 8,
    orderBy: [{ isBestseller: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getStoreContent() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "default" } });
  return (settings?.data ?? {}) as Record<string, unknown>;
}
