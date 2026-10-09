import { prisma } from "@/lib/db";

export default async function Page() {
  const items = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="font-serif text-4xl">Categories</h1>
      <ul className="mt-6 space-y-2">{items.map((item) => <li key={item.id} className="rounded-2xl bg-white p-4">{item.name} · {item.slug}</li>)}</ul>
    </div>
  );
}
