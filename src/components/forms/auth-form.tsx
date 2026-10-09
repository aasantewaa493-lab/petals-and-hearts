"use client";

import { useActionState } from "react";
import { forgotPasswordAction, loginAction, registerAction, type ActionState } from "@/server/actions";
import { Button } from "@/components/ui/button";

const initial: ActionState = { ok: false, message: "" };

export function LoginForm({ next = "/account" }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field name="email" type="email" label="Email" />
      <Field name="password" type="password" label="Password" />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      {state.message && <p className="text-sm text-danger">{state.message}</p>}
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial);
  return (
    <form action={action} className="space-y-4">
      <Field name="name" label="Name" />
      <Field name="email" type="email" label="Email" />
      <Field name="password" type="password" label="Password" />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating…" : "Create account"}
      </Button>
      {state.message && <p className="text-sm text-danger">{state.message}</p>}
    </form>
  );
}

export function ForgotForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initial);
  return (
    <form action={action} className="space-y-4">
      <Field name="email" type="email" label="Email" />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send reset link"}
      </Button>
      {state.message && <p className={state.ok ? "text-sm text-success" : "text-sm text-danger"}>{state.message}</p>}
    </form>
  );
}

function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input name={name} type={type} required className="w-full rounded-2xl border border-line px-3 py-2.5" />
    </label>
  );
}
