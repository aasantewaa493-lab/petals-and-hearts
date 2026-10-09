import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getEnv } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getEnv().siteUrl;
  const [products, categories, collections, occasions] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.collection.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.occasion.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
  ]);
  const staticRoutes = ["", "/shop", "/collections", "/occasions", "/about", "/contact", "/faq", "/custom-bouquet"];
  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((item) => ({ url: `${base}/product/${item.slug}`, lastModified: item.updatedAt })),
    ...categories.map((item) => ({ url: `${base}/shop/${item.slug}`, lastModified: item.updatedAt })),
    ...collections.map((item) => ({ url: `${base}/collections/${item.slug}`, lastModified: item.updatedAt })),
    ...occasions.map((item) => ({ url: `${base}/occasions/${item.slug}`, lastModified: item.updatedAt })),
  ];
}
