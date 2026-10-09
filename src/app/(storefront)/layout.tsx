import { connection } from "next/server";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { cartCount } from "@/server/cart";
import { getStoreContent } from "@/server/catalog";
import { brand } from "@/config/brand";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const [count, content] = await Promise.all([cartCount(), getStoreContent()]);
  const announcement =
    typeof content.announcement === "string" ? content.announcement : brand.announcement;
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader cartCount={count} announcement={announcement} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
