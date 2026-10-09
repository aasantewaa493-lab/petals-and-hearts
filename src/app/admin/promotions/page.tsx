import { prisma } from "@/lib/db";

export default async function Page() {
  const promos = await prisma.promotion.findMany();
  return (
    <div>
      <h1 className="font-serif text-4xl">Promotions</h1>
      <ul className="mt-6 space-y-2">
        {promos.map((promo) => (
          <li key={promo.id} className="rounded-2xl bg-white p-4">
            {promo.code} · {promo.type} · {promo.isDemo ? "demo" : "live"} · {promo.isActive ? "active" : "inactive"}
          </li>
        ))}
      </ul>
    </div>
  );
}
