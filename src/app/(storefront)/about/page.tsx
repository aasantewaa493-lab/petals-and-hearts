import { Prose } from "@/components/content/prose";
import { brand } from "@/config/brand";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Prose title="The studio">
      <p>{brand.description}</p>
      <p>
        This page intentionally avoids invented history, awards, or sourcing claims. Replace it with the official brand story when it is supplied.
      </p>
    </Prose>
  );
}
