import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

async function updateProduct(formData: FormData) {
  "use server";
  await requireRole(["ADMIN", "STAFF"]);
  const id = String(formData.get("id"));
  await prisma.product.update({
    where: { id },
    data: {
      name: String(formData.get("name")),
      shortDescription: String(formData.get("shortDescription")),
      description: String(formData.get("description")),
      pricePesewas: Math.round(Number(formData.get("price")) * 100),
      stockQuantity: Number(formData.get("stock")),
      isActive: formData.get("isActive") === "on",
      isFeatured: formData.get("isFeatured") === "on",
    },
  });
  revalidatePath("/admin/products");
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  return (
    <form action={updateProduct} className="max-w-xl space-y-3">
      <h1 className="font-serif text-4xl">Edit product</h1>
      <input type="hidden" name="id" value={product.id} />
      <input name="name" defaultValue={product.name} className="w-full rounded-2xl border border-line px-3 py-2" />
      <input name="price" type="number" step="0.01" defaultValue={(product.pricePesewas / 100).toFixed(2)} className="w-full rounded-2xl border border-line px-3 py-2" />
      <input name="stock" type="number" defaultValue={product.stockQuantity} className="w-full rounded-2xl border border-line px-3 py-2" />
      <textarea name="shortDescription" defaultValue={product.shortDescription} className="w-full rounded-2xl border border-line px-3 py-2" />
      <textarea name="description" defaultValue={product.description} className="w-full rounded-2xl border border-line px-3 py-2" />
      <label className="block text-sm"><input type="checkbox" name="isActive" defaultChecked={product.isActive} className="mr-2" />Active</label>
      <label className="block text-sm"><input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} className="mr-2" />Featured</label>
      <button className="rounded-full bg-brand px-5 py-2 text-white">Save</button>
    </form>
  );
}
