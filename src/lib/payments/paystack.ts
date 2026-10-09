import { getEnv } from "@/lib/env";
import type { PaymentProvider, PaymentVerification } from "@/lib/payments/types";
import { createHmac } from "crypto";

export const paystackProvider: PaymentProvider = {
  name: "paystack",
  async initialize(input) {
    const secret = getEnv().paystackSecretKey;
    if (!secret) {
      throw new Error("PAYSTACK_SECRET_KEY is not configured.");
    }
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: input.amountPesewas,
        currency: input.currency,
        reference: input.reference,
        callback_url: input.callbackUrl,
      }),
    });
    const payload = (await response.json()) as {
      status: boolean;
      message?: string;
      data?: { authorization_url: string; reference: string };
    };
    if (!payload.status || !payload.data) {
      throw new Error(payload.message ?? "Paystack could not start this payment.");
    }
    return {
      authorizationUrl: payload.data.authorization_url,
      providerReference: payload.data.reference,
    };
  },
  async verify(reference) {
    const secret = getEnv().paystackSecretKey;
    if (!secret) {
      throw new Error("PAYSTACK_SECRET_KEY is not configured.");
    }
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const payload = (await response.json()) as {
      status: boolean;
      data?: { status: string; amount: number; currency: string; reference: string };
    };
    const data = payload.data;
    const paid = payload.status && data?.status === "success";
    return {
      success: Boolean(paid),
      providerReference: data?.reference ?? reference,
      amountPesewas: data?.amount ?? 0,
      currency: data?.currency ?? "GHS",
      status: paid ? "SUCCEEDED" : data?.status === "failed" ? "FAILED" : "PENDING",
    } satisfies PaymentVerification;
  },
  async verifyWebhook(rawBody, signature) {
    const secret = getEnv().paystackWebhookSecret ?? getEnv().paystackSecretKey;
    if (!secret || !signature) return null;
    const digest = createHmac("sha512", secret).update(rawBody).digest("hex");
    if (digest !== signature) return null;
    const body = JSON.parse(rawBody) as {
      event?: string;
      data?: { reference: string; amount: number; currency: string; status: string };
    };
    if (body.event !== "charge.success" || !body.data) return null;
    return {
      success: body.data.status === "success",
      providerReference: body.data.reference,
      amountPesewas: body.data.amount,
      currency: body.data.currency,
      status: body.data.status === "success" ? "SUCCEEDED" : "PENDING",
    };
  },
};
