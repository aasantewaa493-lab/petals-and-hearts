import { ForgotForm } from "@/components/forms/auth-form";

export const metadata = { title: "Reset password" };

export default function ForgotPage() {
  return (
    <div className="container-page max-w-md py-16">
      <h1 className="font-serif text-4xl">Forgot password</h1>
      <p className="mt-2 text-sm text-muted">If the email exists, a reset link is created. Without an email provider it is logged in the server console.</p>
      <div className="mt-6">
        <ForgotForm />
      </div>
    </div>
  );
}
