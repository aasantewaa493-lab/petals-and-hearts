import { RegisterForm } from "@/components/forms/auth-form";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="container-page max-w-md py-16">
      <h1 className="font-serif text-4xl">Create account</h1>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </div>
  );
}
