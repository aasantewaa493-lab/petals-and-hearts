import { prisma } from "@/lib/db";

export default async function Page() {
  const staff = await prisma.user.findMany({ where: { role: { in: ["ADMIN", "STAFF"] } } });
  return (
    <div>
      <h1 className="font-serif text-4xl">Staff</h1>
      <ul className="mt-6 space-y-2">{staff.map((user) => <li key={user.id} className="rounded-2xl bg-white p-4">{user.email} · {user.role}</li>)}</ul>
    </div>
  );
}
