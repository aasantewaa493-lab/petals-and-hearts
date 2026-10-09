import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { fulfillVerifiedPayment } from "@/server/orders";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference") ?? url.searchParams.get("trxref");
  if (!reference) {
    return NextResponse.redirect(new URL("/checkout?error=missing-reference", url.origin));
  }
  const verification = await getPaymentProvider().verify(reference);
  if (!verification.success) {
    return NextResponse.redirect(new URL("/checkout?error=payment", url.origin));
  }
  await fulfillVerifiedPayment(verification.providerReference, verification.amountPesewas);
  return NextResponse.redirect(new URL(`/checkout/success?reference=${reference}`, url.origin));
}
