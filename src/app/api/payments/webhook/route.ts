import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { fulfillVerifiedPayment } from "@/server/orders";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const provider = getPaymentProvider();
  if (!provider.verifyWebhook) {
    return NextResponse.json({ ok: false, reason: "webhooks-not-supported" }, { status: 400 });
  }
  const verification = await provider.verifyWebhook(rawBody, signature);
  if (!verification?.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const existing = await prisma.payment.findUnique({
    where: { providerReference: verification.providerReference },
  });
  if (existing?.status === "SUCCEEDED") {
    return NextResponse.json({ ok: true, idempotent: true });
  }
  await fulfillVerifiedPayment(verification.providerReference, verification.amountPesewas);
  return NextResponse.json({ ok: true });
}
