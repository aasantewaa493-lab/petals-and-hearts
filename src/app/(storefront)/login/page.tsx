import Link from "next/link";
import { LoginForm } from "@/components/forms/auth-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="container-page max-w-md py-16">
      <h1 className="font-serif text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-muted">
        Demo customer: customer@localhost / Customer123!
      </p>
      <div className="mt-6">
        <LoginForm next={next} />
      </div>
      <p className="mt-4 text-sm">
        <Link href="/register" className="text-brand">
          Create an account
        </Link>
        {" · "}
        <Link href="/forgot-password" className="text-brand">
          Forgot password
        </Link>
      </p>
    </div>
  );
}
