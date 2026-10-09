import { Prose } from "@/components/content/prose";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <Prose title="Terms">
      <p>
        By placing an order you agree that prices, delivery fees, and promotions are recalculated on the server, that perishable goods may require approved substitutes, and that payment must be verified before an order is confirmed.
      </p>
    </Prose>
  );
}
