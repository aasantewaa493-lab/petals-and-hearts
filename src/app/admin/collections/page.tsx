import { prisma } from "@/lib/db";

export default async function Page() {
  const items = await prisma.collection.findMany();
  return (
    <div>
      <h1 className="font-serif text-4xl">Collections</h1>
      <ul className="mt-6 space-y-2">{items.map((item) => <li key={item.id} className="rounded-2xl bg-white p-4">{item.name}</li>)}</ul>
    </div>
  );
}
