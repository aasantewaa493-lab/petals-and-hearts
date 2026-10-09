import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { brand, footerLinks } from "@/config/brand";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm leading-6 text-muted">{brand.description}</p>
          <p className="text-xs text-muted">
            Contact details are placeholders until official studio information is supplied.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Shop</h2>
          <ul className="space-y-2 text-sm text-muted">
            {footerLinks.shop.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Help</h2>
          <ul className="space-y-2 text-sm text-muted">
            {footerLinks.help.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Studio notes</h2>
          <NewsletterForm />
          <p className="mt-4 text-sm text-muted">
            {brand.contact.city}, {brand.contact.country}
            <br />
            {brand.contact.email}
          </p>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © 2026 {brand.legalName}.{" "}
        {footerLinks.legal.map((link) => (
          <Link key={link.href} href={link.href} className="mx-2 underline">
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
