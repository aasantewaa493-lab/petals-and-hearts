import Link from "next/link";
import { brand } from "@/config/brand";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-brand-deep" aria-label={brand.name}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <path
            d="M16 27c0-6 7-9 7-15a7 7 0 1 0-14 0c0 6 7 9 7 15Z"
            fill="#8B3FC7"
          />
          <path d="M16 27c0-6-7-9-7-15a7 7 0 0 1 7-7" fill="#7026A6" />
          <path d="M16 14v13" stroke="#43135F" strokeWidth="1.6" />
        </svg>
      </span>
      {!compact && (
        <span className="font-serif text-2xl tracking-tight">{brand.wordmark}</span>
      )}
    </Link>
  );
}
