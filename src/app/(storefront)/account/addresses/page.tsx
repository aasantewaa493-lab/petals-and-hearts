import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { saveAddressAction } from "@/server/actions";

export const metadata = { title: "Addresses" };

export default async function AddressesPage() {
  const user = await requireUser();
  const addresses = await prisma.address.findMany({ where: { userId: user.id } });
  return (
    <div className="container-page py-12">
      <h1 className="font-serif text-4xl">Addresses</h1>
      <ul className="mt-6 space-y-3">
        {addresses.map((address) => (
          <li key={address.id} className="rounded-2xl border border-line p-4 text-sm">
            {address.fullName}, {address.line1}, {address.city}
          </li>
        ))}
      </ul>
      <form action={saveAddressAction} className="mt-8 grid gap-3 rounded-3xl border border-line p-5 md:grid-cols-2">
        <input name="label" placeholder="Label" defaultValue="Home" className="rounded-2xl border border-line px-3 py-2" />
        <input name="fullName" placeholder="Full name" className="rounded-2xl border border-line px-3 py-2" />
        <input name="phone" placeholder="Phone" className="rounded-2xl border border-line px-3 py-2" />
        <input name="line1" placeholder="Address" className="rounded-2xl border border-line px-3 py-2" />
        <input name="city" placeholder="City" className="rounded-2xl border border-line px-3 py-2" />
        <input name="region" placeholder="Region" className="rounded-2xl border border-line px-3 py-2" />
        <button className="rounded-full bg-brand px-5 py-2 text-white md:col-span-2">Save address</button>
      </form>
    </div>
  );
}
