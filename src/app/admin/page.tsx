import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export const metadata = { title: "Admin" };

export default async function AdminHome() {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 30);
  const [orders, paid, pending, lowStock] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: since } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: since }, status: { notIn: ["PENDING_PAYMENT", "PAYMENT_FAILED", "CANCELLED"] } },
      _sum: { totalPesewas: true },
      _count: true,
    }),
    prisma.order.count({ where: { status: { in: ["PAID", "PROCESSING"] } } }),
    prisma.product.count({ where: { stockQuantity: { lte: 3 }, isActive: true } }),
  ]);
  const recent = await prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-serif text-4xl">Last 30 days</h1>
      <p className="mt-1 text-sm text-muted">Revenue is the sum of orders that are not pending, failed, or cancelled. It is collected revenue only after payment verification.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="Orders created" value={String(orders)} />
        <Stat label="Verified order value" value={formatMoney(paid._sum.totalPesewas ?? 0)} />
        <Stat label="Awaiting fulfillment" value={String(pending)} />
        <Stat label="Low stock products" value={String(lowStock)} />
      </div>
      <h2 className="mt-10 font-serif text-2xl">Recent orders</h2>
      <ul className="mt-4 space-y-2">
        {recent.map((order) => (
          <li key={order.id} className="rounded-2xl bg-white p-4 text-sm">
            {order.reference} · {order.status} · {formatMoney(order.totalPesewas)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
