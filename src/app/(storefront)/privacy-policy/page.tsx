import { Prose } from "@/components/content/prose";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <Prose title="Privacy">
      <p>
        We collect the information needed to fulfill an order: name, email, phone, delivery address, and optional gift message. Payment card data is handled by the payment provider and is never stored here.
      </p>
      <p>
        Order records are retained for fulfillment, accounting, and refunds. Marketing email is sent only after explicit consent.
      </p>
    </Prose>
  );
}
