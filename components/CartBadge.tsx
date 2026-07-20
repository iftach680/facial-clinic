"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartBadge() {
  const { totalCount } = useCart();

  return (
    <Link
      href="/shop/cart"
      className="relative rounded-full px-3.5 py-1.5 text-sm text-stone-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
    >
      עגלה
      {totalCount > 0 && (
        <span className="absolute -top-1 -left-1 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
          {totalCount}
        </span>
      )}
    </Link>
  );
}
