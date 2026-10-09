import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export default async function Page() {
  const zones = await prisma.deliveryZone.findMany();
  return (
    <div>
      <h1 className="font-serif text-4xl">Delivery zones</h1>
      <ul className="mt-6 space-y-2">
        {zones.map((zone) => (
          <li key={zone.id} className="rounded-2xl bg-white p-4">
            {zone.name} · {formatMoney(zone.feePesewas)} · cutoff {zone.cutoffHour}:00 · capacity {zone.dailyCapacity}/day
          </li>
        ))}
      </ul>
    </div>
  );
}
