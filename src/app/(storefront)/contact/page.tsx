import { contactAction } from "@/server/actions";
import { brand } from "@/config/brand";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container-page grid gap-10 py-12 md:grid-cols-2">
      <div>
        <h1 className="font-serif text-5xl">Contact</h1>
        <p className="mt-4 text-sm text-muted">
          The details below are placeholders until official contact information is provided.
        </p>
        <p className="mt-4 text-sm">
          {brand.contact.email}
          <br />
          {brand.contact.phone}
          <br />
          {brand.contact.city}, {brand.contact.country}
        </p>
      </div>
      <form action={contactAction} className="space-y-3 rounded-3xl border border-line bg-white p-6">
        <input name="name" placeholder="Name" className="w-full rounded-2xl border border-line px-3 py-2" />
        <input name="email" type="email" placeholder="Email" className="w-full rounded-2xl border border-line px-3 py-2" />
        <input name="subject" placeholder="Subject" className="w-full rounded-2xl border border-line px-3 py-2" />
        <textarea name="message" placeholder="Message" rows={5} className="w-full rounded-2xl border border-line px-3 py-2" />
        <button className="w-full rounded-full bg-brand py-3 text-white">Send</button>
      </form>
    </div>
  );
}
