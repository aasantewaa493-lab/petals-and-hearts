import { notFound } from "next/navigation";
import { getOrderByReference } from "@/server/orders";
import { customerVisibleStatus } from "@/lib/order-status";
import { formatMoney } from "@/lib/money";

export default async function TrackResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const [{ reference }, { email }] = await Promise.all([params, searchParams]);
  const order = await getOrderByReference(reference, email);
  if (!order) notFound();
  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="font-serif text-4xl">{order.reference}</h1>
      <p className="mt-2">{customerVisibleStatus[order.status]} · {formatMoney(order.totalPesewas)}</p>
      <ol className="mt-8 space-y-3">
        {order.events.map((event) => (
          <li key={event.id} className="rounded-2xl border border-line p-3 text-sm">
            {customerVisibleStatus[event.status]}
            {event.note ? ` — ${event.note}` : ""}
          </li>
        ))}
      </ol>
    </div>
  );
}
