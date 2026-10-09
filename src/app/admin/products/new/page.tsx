import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";

async function createProduct(formData: FormData) {
  "use server";
  await requireRole(["ADMIN"]);
  const name = String(formData.get("name") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const pricePesewas = Math.round(Number(formData.get("price") ?? 0) * 100);
  const product = await prisma.product.create({
    data: {
      name,
      slug: slugify(name),
      shortDescription: String(formData.get("shortDescription") ?? "New arrangement"),
      description: String(formData.get("description") ?? "Product description to be completed."),
      categoryId,
      pricePesewas,
      stockQuantity: Number(formData.get("stock") ?? 0),
      flowerVarieties: [],
      colors: [],
      tags: [],
      isDemo: false,
      images: { create: [{ url: String(formData.get("imageUrl") ?? ""), alt: name }] },
      inventory: { create: { quantity: Number(formData.get("stock") ?? 0) } },
    },
  });
  revalidatePath("/admin/products");
  redirect(`/admin/products/${product.id}`);
}

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();
  return (
    <form action={createProduct} className="max-w-xl space-y-3">
      <h1 className="font-serif text-4xl">New product</h1>
      <input name="name" required placeholder="Name" className="w-full rounded-2xl border border-line px-3 py-2" />
      <select name="categoryId" className="w-full rounded-2xl border border-line px-3 py-2">
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <input name="price" type="number" step="0.01" required placeholder="Price in cedis" className="w-full rounded-2xl border border-line px-3 py-2" />
      <input name="stock" type="number" placeholder="Stock" className="w-full rounded-2xl border border-line px-3 py-2" />
      <input name="imageUrl" placeholder="Image URL" className="w-full rounded-2xl border border-line px-3 py-2" />
      <textarea name="shortDescription" placeholder="Short description" className="w-full rounded-2xl border border-line px-3 py-2" />
      <textarea name="description" placeholder="Full description" className="w-full rounded-2xl border border-line px-3 py-2" />
      <button className="rounded-full bg-brand px-5 py-2 text-white">Create</button>
    </form>
  );
}
