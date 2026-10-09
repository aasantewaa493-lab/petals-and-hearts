import { applyRuntimeEnv } from "@/lib/runtime-env";

applyRuntimeEnv();

function optional(name: string) {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export function getEnv() {
  return {
    databaseUrl: process.env.DATABASE_URL ?? "file:./dev.db",
    authSecret: process.env.AUTH_SECRET ?? "dev-only-change-me-not-for-production",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    paymentProvider: (process.env.PAYMENT_PROVIDER ?? "mock") as "mock" | "paystack",
    paystackPublicKey: optional("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"),
    paystackSecretKey: optional("PAYSTACK_SECRET_KEY"),
    paystackWebhookSecret: optional("PAYSTACK_WEBHOOK_SECRET"),
    resendApiKey: optional("RESEND_API_KEY"),
    emailFrom: optional("EMAIL_FROM_ADDRESS") ?? "Petals & Hearts <noreply@localhost>",
    adminBootstrapEmail: optional("ADMIN_BOOTSTRAP_EMAIL") ?? "admin@localhost",
    adminBootstrapPassword: optional("ADMIN_BOOTSTRAP_PASSWORD") ?? "ChangeMeNow!Admin",
  };
}

export function isProductionPayment() {
  return process.env.NODE_ENV === "production" && getEnv().paymentProvider !== "mock";
}
