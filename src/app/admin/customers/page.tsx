import { prisma } from "@/lib/db";

export default async function Page() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-serif text-4xl">Customers</h1>
      <ul className="mt-6 space-y-2">{users.map((user) => <li key={user.id} className="rounded-2xl bg-white p-4 text-sm">{user.email} · {user.role}</li>)}</ul>
    </div>
  );
}
