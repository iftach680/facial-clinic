import Link from "next/link";
import { prisma } from "@/lib/prisma";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfLast7Days() {
  const d = startOfToday();
  d.setDate(d.getDate() - 6);
  return d;
}

export default async function AdminDashboard() {
  const [pendingAppointments, pendingOrders, productCount, serviceCount, visitsToday, visits7Days, visitsTotal] =
    await Promise.all([
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
      prisma.product.count({ where: { active: true } }),
      prisma.service.count({ where: { active: true } }),
      prisma.pageView.count({ where: { createdAt: { gte: startOfToday() } } }),
      prisma.pageView.count({ where: { createdAt: { gte: startOfLast7Days() } } }),
      prisma.pageView.count(),
    ]);

  const cards = [
    { href: "/admin/appointments", label: "תורים ממתינים", value: pendingAppointments },
    { href: "/admin/orders", label: "הזמנות ממתינות", value: pendingOrders },
    { href: "/admin/products", label: "מוצרים פעילים", value: productCount },
    { href: "/admin/services", label: "טיפולים פעילים", value: serviceCount },
  ];

  const visitCards = [
    { label: "כניסות היום", value: visitsToday },
    { label: "כניסות ב-7 ימים אחרונים", value: visits7Days },
    { label: 'סה"כ כניסות מאז ההשקה', value: visitsTotal },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-lg font-semibold text-stone-800">סקירה כללית</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-xl bg-white border border-stone-200 p-4 hover:border-rose-300 transition-colors"
            >
              <div className="text-2xl font-semibold text-stone-800">{card.value}</div>
              <div className="text-sm text-stone-500 mt-1">{card.label}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-stone-800">תנועה באתר</h2>
        <div className="grid grid-cols-3 gap-3">
          {visitCards.map((card) => (
            <div key={card.label} className="rounded-xl bg-rose-50 border border-rose-100 p-4">
              <div className="text-2xl font-semibold text-stone-800">{card.value}</div>
              <div className="text-sm text-stone-500 mt-1">{card.label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400">
          המספרים כאן הם ספירה פשוטה של כניסות לאתר. נתונים מפורטים יותר (מכשירים, מקורות תנועה) זמינים בלוח הבקרה של
          Vercel Analytics לאחר ההעלאה לאוויר.
        </p>
      </div>
    </div>
  );
}
