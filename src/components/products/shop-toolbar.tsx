import Link from "next/link";

const sorts = [
  { href: "?sort=featured", label: "Featured" },
  { href: "?sort=newest", label: "Newest" },
  { href: "?sort=price-asc", label: "Price: low to high" },
  { href: "?sort=price-desc", label: "Price: high to low" },
];

export function ShopToolbar() {
  return (
    <div className="container-page flex flex-wrap items-center justify-between gap-3 pt-8 text-sm">
      <p className="text-muted">Filter combinations stay in the URL so you can share a view.</p>
      <div className="flex flex-wrap gap-2">
        {sorts.map((sort) => (
          <Link key={sort.href} href={sort.href} className="rounded-full border border-line px-3 py-1 hover:border-brand">
            {sort.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
