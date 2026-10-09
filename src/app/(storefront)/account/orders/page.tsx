import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { customerVisibleStatus } from "@/lib/order-status";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="container-page py-12">
      <h1 className="font-serif text-4xl">Orders</h1>
      <ul className="mt-6 space-y-3">
        {orders.map((order) => (
          <li key={order.id}>
            <Link href={`/account/orders/${order.id}`} className="flex justify-between rounded-2xl border border-line p-4">
              <span>{order.reference}</span>
              <span>{customerVisibleStatus[order.status]} · {formatMoney(order.totalPesewas)}</span>
            </Link>
          </li>
        ))}
        {orders.length === 0 && <p className="text-muted">No orders yet.</p>}
      </ul>
    </div>
  );
}
