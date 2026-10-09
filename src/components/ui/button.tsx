import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const styles = {
  primary:
    "bg-brand text-white hover:bg-brand-royal shadow-sm",
  secondary:
    "bg-white text-brand-deep border border-line hover:border-brand",
  ghost: "bg-transparent text-brand-deep hover:bg-lavender",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: keyof typeof styles;
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 pill px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50",
    styles[variant],
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
