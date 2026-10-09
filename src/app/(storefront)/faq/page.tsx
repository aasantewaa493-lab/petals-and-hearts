import { Prose } from "@/components/content/prose";

export const metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <Prose title="Questions">
      <p><strong>When will my flowers arrive?</strong> Delivery dates are selected at checkout and validated against zone capacity. We do not promise a slot that is already full.</p>
      <p><strong>Can I include a card?</strong> Yes. Gift messages are collected on the product and checkout forms.</p>
      <p><strong>What if a stem is unavailable?</strong> You choose the substitution policy at checkout.</p>
      <p><strong>Are these real products?</strong> The seeded catalogue is demo data for development. Replace it before launch.</p>
    </Prose>
  );
}
