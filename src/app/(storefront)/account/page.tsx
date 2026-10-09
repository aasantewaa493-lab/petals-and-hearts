import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { logoutAction } from "@/server/actions";
import { prisma } from "@/lib/db";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser();
  const orders = await prisma.order.count({ where: { userId: user.id } });
  return (
    <div className="container-page py-12">
      <h1 className="font-serif text-4xl">Hello{user.name ? `, ${user.name}` : ""}</h1>
      <p className="mt-2 text-muted">{user.email}</p>
      <p className="mt-1 text-sm text-muted">{orders} order{orders === 1 ? "" : "s"} on this account.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["/account/profile", "Profile"],
          ["/account/addresses", "Addresses"],
          ["/account/orders", "Orders"],
          ["/account/wishlist", "Wishlist"],
          ["/account/notifications", "Notifications"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="rounded-3xl border border-line bg-white p-5 hover:border-brand">
            {label}
          </Link>
        ))}
      </div>
      <form action={logoutAction} className="mt-8">
        <button className="text-sm underline">Sign out</button>
      </form>
    </div>
  );
}
