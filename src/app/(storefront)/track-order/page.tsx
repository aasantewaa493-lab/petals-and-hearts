import { trackOrderAction } from "@/server/actions";

export const metadata = { title: "Track order" };

export default function TrackOrderPage() {
  return (
    <div className="container-page max-w-lg py-16">
      <h1 className="font-serif text-4xl">Track an order</h1>
      <form action={trackOrderAction} className="mt-6 space-y-3">
        <input name="reference" placeholder="Order reference" className="w-full rounded-2xl border border-line px-3 py-2" />
        <input name="email" type="email" placeholder="Email used at checkout" className="w-full rounded-2xl border border-line px-3 py-2" />
        <button className="w-full rounded-full bg-brand py-3 text-white">Look up</button>
      </form>
    </div>
  );
}
