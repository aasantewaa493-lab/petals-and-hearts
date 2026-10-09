import { Prose } from "@/components/content/prose";
import { brand } from "@/config/brand";

export const metadata = { title: "Delivery" };

export default function DeliveryPage() {
  return (
    <Prose title="Delivery">
      <p>{brand.delivery.leadTimeNote}</p>
      <p>{brand.delivery.sameDayCutoffNote}</p>
      <p>{brand.delivery.substitutionPolicy}</p>
      <p>Fees and available dates are controlled by delivery zones in the admin dashboard.</p>
    </Prose>
  );
}
