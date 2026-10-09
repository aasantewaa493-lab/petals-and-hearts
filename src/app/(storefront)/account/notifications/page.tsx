import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const user = await requireUser();
  const prefs = await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
  return (
    <div className="container-page max-w-lg py-12">
      <h1 className="font-serif text-4xl">Notifications</h1>
      <ul className="mt-6 space-y-2 text-sm">
        <li>Order updates: {prefs.orderUpdates ? "on" : "off"}</li>
        <li>Marketing email: {prefs.marketingEmail ? "on" : "off"}</li>
        <li>Occasion reminders: {prefs.occasionReminders ? "on" : "off"}</li>
      </ul>
      <p className="mt-4 text-xs text-muted">Marketing stays off unless you opt in. Occasion reminders are a future-ready preference and are not sent automatically yet.</p>
    </div>
  );
}
