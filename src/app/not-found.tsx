import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="font-serif text-5xl">This page is not here</h1>
      <p className="mt-3 text-muted">The arrangement you were looking for may have been moved.</p>
      <Button href="/shop" className="mt-6">
        Browse the shop
      </Button>
    </div>
  );
}
