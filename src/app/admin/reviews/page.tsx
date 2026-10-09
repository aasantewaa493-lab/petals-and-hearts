import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

async function publish(formData: FormData) {
  "use server";
  await requireRole(["ADMIN", "STAFF"]);
  await prisma.productReview.update({
    where: { id: String(formData.get("id")) },
    data: { status: String(formData.get("status")) as "PUBLISHED" | "REJECTED" },
  });
  revalidatePath("/admin/reviews");
}

export default async function Page() {
  const reviews = await prisma.productReview.findMany({ include: { product: true }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-serif text-4xl">Reviews</h1>
      <ul className="mt-6 space-y-3">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-2xl bg-white p-4">
            <p>{review.product.name} · {review.rating}★ · {review.status}</p>
            <p className="text-sm text-muted">{review.body}</p>
            <form action={publish} className="mt-2 flex gap-2">
              <input type="hidden" name="id" value={review.id} />
              <button name="status" value="PUBLISHED" className="text-sm text-success">Publish</button>
              <button name="status" value="REJECTED" className="text-sm text-danger">Reject</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
