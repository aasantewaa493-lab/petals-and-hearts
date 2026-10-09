import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <div>
      <h1 className="font-serif text-4xl">Orders</h1>
      <ul className="mt-6 space-y-2">
        {orders.map((order) => (
          <li key={order.id}>
            <Link href={`/admin/orders/${order.id}`} className="flex justify-between rounded-2xl bg-white p-4 text-sm">
              <span>{order.reference}</span>
              <span>{order.status} · {formatMoney(order.totalPesewas)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
