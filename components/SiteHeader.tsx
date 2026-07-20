import Link from "next/link";
import CartBadge from "@/components/CartBadge";

const NAV = [
  { href: "/", label: "בית" },
  { href: "/book", label: "קביעת תור" },
  { href: "/shop", label: "חנות" },
];

export default function SiteHeader() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "עסק הקוסמטיקה";

  return (
    <header className="border-b border-rose-100 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-stone-800">
          {businessName}
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-stone-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <CartBadge />
        </nav>
      </div>
    </header>
  );
}
