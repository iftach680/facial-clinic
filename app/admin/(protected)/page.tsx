import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [pendingAppointments, pendingOrders, productCount, serviceCount] = await Promise.all([
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.product.count({ where: { active: true } }),
    prisma.service.count({ where: { active: true } }),
  ]);

  const cards = [
    { href: "/admin/appointments", label: "תורים ממתינים", value: pendingAppointments },
    { href: "/admin/orders", label: "הזמנות ממתינות", value: pendingOrders },
    { href: "/admin/products", label: "מוצרים פעילים", value: productCount },
    { href: "/admin/services", label: "טיפולים פעילים", value: serviceCount },
  ];

  return (
    <div className="space-y-6">
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
  );
}
