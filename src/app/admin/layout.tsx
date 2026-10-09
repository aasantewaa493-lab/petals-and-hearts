import Link from "next/link";
import { requireRole } from "@/lib/auth/session";

const links = [
  ["/admin", "Overview"],
  ["/admin/products", "Products"],
  ["/admin/categories", "Categories"],
  ["/admin/collections", "Collections"],
  ["/admin/orders", "Orders"],
  ["/admin/customers", "Customers"],
  ["/admin/inventory", "Inventory"],
  ["/admin/promotions", "Promotions"],
  ["/admin/delivery", "Delivery"],
  ["/admin/reviews", "Reviews"],
  ["/admin/content", "Content"],
  ["/admin/settings", "Settings"],
  ["/admin/reports", "Reports"],
  ["/admin/staff", "Staff"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["ADMIN", "STAFF"]);
  return (
    <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
      <aside className="border-r border-line bg-white p-6">
        <p className="font-serif text-2xl">Studio</p>
        <nav className="mt-6 grid gap-2 text-sm">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-xl px-2 py-1 hover:bg-lavender">
              {label}
            </Link>
          ))}
          <Link href="/" className="mt-6 text-brand">
            View storefront
          </Link>
        </nav>
      </aside>
      <div className="bg-lavender-pale p-6 lg:p-10">{children}</div>
    </div>
  );
}
