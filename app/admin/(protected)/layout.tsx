import Link from "next/link";

const NAV = [
  { href: "/admin", label: "לוח בקרה" },
  { href: "/admin/appointments", label: "תורים" },
  { href: "/admin/orders", label: "הזמנות" },
  { href: "/admin/products", label: "מוצרים" },
  { href: "/admin/services", label: "טיפולים" },
  { href: "/admin/hours", label: "שעות פעילות" },
];

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <span className="font-semibold text-stone-800">פאנל ניהול</span>
          <form action="/api/admin/logout" method="POST">
            <button className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
              התנתקות
            </button>
          </form>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto pb-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm text-stone-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </>
  );
}
