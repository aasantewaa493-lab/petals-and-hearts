import { completeMockPaymentAction } from "@/server/actions";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { getEnv } from "@/lib/env";
import { notFound } from "next/navigation";

export const metadata = { title: "Test payment" };

export default async function MockPayPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  if (getEnv().paymentProvider !== "mock") notFound();
  const { reference } = await searchParams;
  const payment = reference
    ? await prisma.payment.findUnique({ where: { providerReference: reference }, include: { order: true } })
    : null;
  if (!payment) notFound();
  return (
    <div className="container-page max-w-lg py-16">
      <p className="text-sm text-warning">Local mock payment — not a real charge</p>
      <h1 className="mt-2 font-serif text-4xl">Confirm test payment</h1>
      <p className="mt-3 text-muted">
        Order {payment.order.reference} · {formatMoney(payment.amountPesewas, payment.currency)}
      </p>
      <form action={completeMockPaymentAction} className="mt-8 grid gap-3">
        <input type="hidden" name="reference" value={reference} />
        <button name="decision" value="SUCCEEDED" className="rounded-full bg-brand py-3 font-semibold text-white">
          Simulate successful payment
        </button>
        <button name="decision" value="FAILED" className="rounded-full border border-line py-3">
          Simulate failed payment
        </button>
      </form>
    </div>
  );
}
