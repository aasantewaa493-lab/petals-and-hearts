import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export default async function Page() {
  const paid = await prisma.order.aggregate({
    where: { status: { in: ["PAID", "PROCESSING", "READY_FOR_DISPATCH", "OUT_FOR_DELIVERY", "DELIVERED"] } },
    _sum: { totalPesewas: true },
    _avg: { totalPesewas: true },
    _count: true,
  });
  return (
    <div>
      <h1 className="font-serif text-4xl">Reports</h1>
      <p className="mt-2 text-sm text-muted">Verified-payment orders only. This is not profit.</p>
      <ul className="mt-6 space-y-2">
        <li>Orders: {paid._count}</li>
        <li>Collected value: {formatMoney(paid._sum.totalPesewas ?? 0)}</li>
        <li>Average order: {formatMoney(Math.round(paid._avg.totalPesewas ?? 0))}</li>
      </ul>
    </div>
  );
}
