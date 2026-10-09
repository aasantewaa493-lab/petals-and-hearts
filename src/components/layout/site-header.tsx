"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { navigation } from "@/config/brand";
import { cn } from "@/lib/utils";

type SearchHit = { name: string; slug: string; pricePesewas: number; image: string };

export function SiteHeader({ cartCount, announcement }: { cartCount: number; announcement?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) return;
    const handle = setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = (await response.json()) as { products: SearchHit[] };
      setHits(data.products);
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);
  const results = query.trim().length < 2 ? [] : hits;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
      {announcement && (
        <p className="bg-brand-deep px-4 py-2 text-center text-xs text-white sm:text-sm">{announcement}</p>
      )}
      <div className="container-page flex items-center justify-between gap-4 py-4">
        <Logo />
        <nav className="hidden items-center gap-5 text-sm lg:flex" aria-label="Primary">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-ink/80 hover:text-brand">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button
            className="rounded-full p-2 hover:bg-lavender"
            aria-label="Search"
            onClick={() => setSearchOpen((value) => !value)}
          >
            <Search className="h-5 w-5" />
          </button>
          <Link href="/account" className="rounded-full p-2 hover:bg-lavender" aria-label="Account">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/wishlist" className="rounded-full p-2 hover:bg-lavender" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="relative rounded-full p-2 hover:bg-lavender" aria-label="Shopping bag">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="rounded-full p-2 hover:bg-lavender lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className="border-t border-line bg-white">
          <div className="container-page py-4">
            <label className="sr-only" htmlFor="site-search">
              Search flowers
            </label>
            <input
              id="site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search roses, tulips, occasions…"
              className="w-full rounded-full border border-line px-4 py-3"
            />
            {results.length > 0 && (
              <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-white">
                {results.map((hit) => (
                  <li key={hit.slug}>
                    <Link href={`/product/${hit.slug}`} className="block px-4 py-3 hover:bg-lavender-pale" onClick={() => setSearchOpen(false)}>
                      {hit.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={`/search?q=${encodeURIComponent(query)}`} className="block px-4 py-3 text-sm text-brand">
                    View all results
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
      {open && (
      <div
        className="fixed inset-0 z-50 bg-black/30 lg:hidden"
        onClick={() => setOpen(false)}
      />
      )}
      {open && (
      <aside
        className="fixed inset-y-0 right-0 z-50 w-[min(86vw,360px)] bg-white p-6 shadow-soft lg:hidden"
      >
        <div className="mb-6 flex items-center justify-between">
          <Logo compact />
          <button onClick={() => setOpen(false)} aria-label="Close menu">
            <X />
          </button>
        </div>
        <nav className="grid gap-3 text-lg" aria-label="Mobile">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      )}
    </header>
  );
}
