import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { adminUpdateOrderAction } from "@/server/actions";
import { formatMoney } from "@/lib/money";

const nextOptions = ["PROCESSING", "READY_FOR_DISPATCH", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REFUNDED"] as const;

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, addresses: true, payments: true, events: true },
  });
  if (!order) notFound();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl">{order.reference}</h1>
      <p>{order.status} · {formatMoney(order.totalPesewas)} · {order.email}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>{item.name} × {item.quantity}</li>
        ))}
      </ul>
      <form action={adminUpdateOrderAction} className="flex gap-2">
        <input type="hidden" name="orderId" value={order.id} />
        <select name="status" className="rounded-2xl border border-line px-3 py-2">
          {nextOptions.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <input name="note" placeholder="Internal note" className="rounded-2xl border border-line px-3 py-2" />
        <button className="rounded-full bg-brand px-4 text-white">Update</button>
      </form>
    </div>
  );
}
