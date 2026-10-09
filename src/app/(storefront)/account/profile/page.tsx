import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: sessionUser.id } });
  return (
    <div className="container-page max-w-xl py-12">
      <h1 className="font-serif text-4xl">Profile</h1>
      <dl className="mt-6 space-y-3 text-sm">
        <div><dt className="text-muted">Name</dt><dd>{user.name ?? "—"}</dd></div>
        <div><dt className="text-muted">Email</dt><dd>{user.email}</dd></div>
        <div><dt className="text-muted">Role</dt><dd>{user.role}</dd></div>
      </dl>
    </div>
  );
}
