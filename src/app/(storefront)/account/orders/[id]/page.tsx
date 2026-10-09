import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { customerVisibleStatus } from "@/lib/order-status";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true, events: true },
  });
  if (!order) notFound();
  return (
    <div className="container-page py-12">
      <h1 className="font-serif text-4xl">{order.reference}</h1>
      <p className="mt-2 text-muted">{customerVisibleStatus[order.status]} · {formatMoney(order.totalPesewas)}</p>
      <ul className="mt-6 space-y-2">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity} · {formatMoney(item.linePesewas)}
          </li>
        ))}
      </ul>
    </div>
  );
}
