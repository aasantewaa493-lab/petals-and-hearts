import { resetPasswordAction } from "@/server/actions";

export const metadata = { title: "Choose a new password" };

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <div className="container-page max-w-md py-16">
      <h1 className="font-serif text-4xl">New password</h1>
      <form action={resetPasswordAction} className="mt-6 space-y-4">
        <input type="hidden" name="token" value={token ?? ""} />
        <input name="password" type="password" minLength={8} required placeholder="New password" className="w-full rounded-2xl border border-line px-3 py-2" />
        <button className="w-full rounded-full bg-brand py-3 text-white">Update password</button>
      </form>
    </div>
  );
}
