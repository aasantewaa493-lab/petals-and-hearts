import { brand } from "@/config/brand";
import { getEnv } from "@/lib/env";

export default function Page() {
  const env = getEnv();
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="font-serif text-4xl">Settings</h1>
      <p>Brand name: {brand.name}</p>
      <p>Currency: {brand.currency}</p>
      <p>Payment provider: {env.paymentProvider}</p>
      <p>Site URL: {env.siteUrl}</p>
      <p className="text-sm text-muted">Official phone, email, and address remain placeholders in src/config/brand.ts until supplied.</p>
    </div>
  );
}
