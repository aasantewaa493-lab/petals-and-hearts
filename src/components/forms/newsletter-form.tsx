"use client";

import { useActionState } from "react";
import { newsletterAction, type ActionState } from "@/server/actions";

const initial: ActionState = { ok: false, message: "" };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(newsletterAction, initial);
  return (
    <form action={action} className="space-y-3">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="Email address"
        className="w-full rounded-full border border-line px-4 py-2.5 text-sm"
      />
      <label className="flex items-start gap-2 text-xs text-muted">
        <input type="checkbox" name="consent" className="mt-0.5" />
        I agree to receive studio notes. I can unsubscribe at any time.
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Subscribing…" : "Subscribe"}
      </button>
      {state.message && (
        <p className={state.ok ? "text-sm text-success" : "text-sm text-danger"} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
