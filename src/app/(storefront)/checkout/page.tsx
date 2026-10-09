import { quoteCart } from "@/server/cart";
import { prisma } from "@/lib/db";
import { checkoutAction } from "@/server/actions";
import { formatMoney } from "@/lib/money";
import { upcomingDeliveryDates } from "@/lib/delivery";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ cart, quote }, zones, user, params] = await Promise.all([
    quoteCart(),
    prisma.deliveryZone.findMany({ where: { isActive: true } }),
    getSessionUser(),
    searchParams,
  ]);
  if (cart.items.length === 0) redirect("/cart");
  const firstZone = zones[0];
  const dates = firstZone
    ? upcomingDeliveryDates({
        feePesewas: firstZone.feePesewas,
        cutoffHour: firstZone.cutoffHour,
        leadDays: firstZone.leadDays,
        sameDay: firstZone.sameDay,
        dailyCapacity: firstZone.dailyCapacity,
      })
    : [];

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr]">
      <form action={checkoutAction} className="space-y-4 rounded-3xl border border-line bg-white p-6">
        <h1 className="font-serif text-4xl">Checkout</h1>
        {params.error && <p className="rounded-2xl bg-lavender p-3 text-sm text-danger">Payment was not completed. You can try again.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="purchaserName" label="Your name" defaultValue={user?.name ?? ""} />
          <Input name="email" type="email" label="Email" defaultValue={user?.email ?? ""} />
          <Input name="phone" label="Phone" />
          <label className="flex items-end gap-2 text-sm">
            <input type="checkbox" name="isGift" defaultChecked /> This is a gift
          </label>
          <Input name="recipientName" label="Recipient name" />
          <Input name="line1" label="Delivery address" />
          <Input name="city" label="City" defaultValue="Accra" />
          <Input name="region" label="Region" defaultValue="Greater Accra" />
          <label className="text-sm md:col-span-2">
            Delivery zone
            <select name="zoneId" className="mt-1 w-full rounded-2xl border border-line px-3 py-2">
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} · {formatMoney(zone.feePesewas)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Delivery date
            <select name="deliveryDate" className="mt-1 w-full rounded-2xl border border-line px-3 py-2">
              {dates.map((date) => (
                <option key={date.toISOString()} value={date.toISOString()}>
                  {format(date, "EEEE d MMMM")}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Window
            <select name="deliveryWindow" className="mt-1 w-full rounded-2xl border border-line px-3 py-2">
              <option>Morning 09:00–12:00</option>
              <option>Afternoon 12:00–16:00</option>
              <option>Evening 16:00–18:00</option>
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            Gift message
            <textarea name="giftMessage" className="mt-1 w-full rounded-2xl border border-line px-3 py-2" />
          </label>
          <label className="text-sm md:col-span-2">
            If a stem is unavailable
            <select name="substitutionPolicy" className="mt-1 w-full rounded-2xl border border-line px-3 py-2">
              <option value="APPROVED_SUBSTITUTES">Use an approved substitute of equal value</option>
              <option value="CONTACT_CUSTOMER">Contact me first</option>
              <option value="CANCEL_IF_UNAVAILABLE">Cancel the affected item</option>
            </select>
          </label>
        </div>
        <button className="w-full rounded-full bg-brand py-3 font-semibold text-white">Continue to payment</button>
      </form>
      <aside className="h-fit rounded-3xl bg-lavender-pale p-6">
        <h2 className="font-serif text-2xl">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>{formatMoney((item.variant?.pricePesewas ?? item.product.pricePesewas) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">Merchandise {formatMoney(quote.subtotalPesewas - quote.discountPesewas)}</p>
        <p className="text-xs text-muted">Delivery is added from the selected zone when the order is created. Totals are recalculated on the server.</p>
      </aside>
    </div>
  );
}

function Input({
  name,
  label,
  type = "text",
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <label className="text-sm">
      {label}
      <input name={name} type={type} defaultValue={defaultValue} required className="mt-1 w-full rounded-2xl border border-line px-3 py-2" />
    </label>
  );
}
