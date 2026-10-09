import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

async function save(formData: FormData) {
  "use server";
  await requireRole(["ADMIN"]);
  const current = await prisma.storeSettings.findUnique({ where: { id: "default" } });
  const data = (current?.data ?? {}) as Record<string, unknown>;
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {
      data: {
        ...data,
        announcement: String(formData.get("announcement") ?? ""),
        story: String(formData.get("story") ?? ""),
      },
    },
    create: { id: "default", data: { announcement: String(formData.get("announcement") ?? "") } },
  });
  revalidatePath("/");
}

export default async function Page() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "default" } });
  const data = (settings?.data ?? {}) as Record<string, string>;
  return (
    <form action={save} className="max-w-2xl space-y-3">
      <h1 className="font-serif text-4xl">Content</h1>
      <textarea name="announcement" defaultValue={data.announcement} className="h-24 w-full rounded-2xl border border-line p-3" />
      <textarea name="story" defaultValue={data.story} className="h-40 w-full rounded-2xl border border-line p-3" />
      <button className="rounded-full bg-brand px-5 py-2 text-white">Save</button>
    </form>
  );
}
