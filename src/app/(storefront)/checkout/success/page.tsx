import { getOrderByReference } from "@/server/orders";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Order confirmed" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;
  const order = reference ? await getOrderByReference(reference) : null;
  if (!order || order.status === "PENDING_PAYMENT" || order.status === "PAYMENT_FAILED") {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-4xl">Payment not verified</h1>
        <p className="mt-3 text-muted">We only confirm orders after the payment provider (or the local mock) verifies them.</p>
        <Button href="/track-order" className="mt-6">
          Track an order
        </Button>
      </div>
    );
  }
  return (
    <div className="container-page max-w-2xl py-16">
      <p className="text-sm text-brand">Payment verified</p>
      <h1 className="font-serif text-5xl">Thank you</h1>
      <p className="mt-4 text-muted">
        Order <strong>{order.reference}</strong> is confirmed for {formatMoney(order.totalPesewas, order.currency)}.
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex gap-3">
        <Button href={`/track-order/${order.reference}`}>Track this order</Button>
        <Button href="/shop" variant="secondary">
          Continue shopping
        </Button>
      </div>
    </div>
  );
}
