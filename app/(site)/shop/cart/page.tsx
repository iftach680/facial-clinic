"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/actions/orders";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "נא למלא את כל השדות כראוי",
  stock: "אחד המוצרים בעגלה אינו זמין במלאי המבוקש",
};

export default function CartPage() {
  return (
    <Suspense fallback={null}>
      <CartPageInner />
    </Suspense>
  );
}

function CartPageInner() {
  const { items, setQuantity, removeItem, totalPrice } = useCart();
  const searchParams = useSearchParams();
  const errorMessage = ERROR_MESSAGES[searchParams.get("error") ?? ""];

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-semibold text-stone-800">העגלה ריקה</h1>
        <Link href="/shop" className="inline-block text-sm text-rose-600 hover:text-rose-800">
          למעבר לחנות
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-2xl font-semibold text-stone-800">עגלת קניות</h1>

      {errorMessage && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{errorMessage}</p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 border border-stone-200 rounded-xl p-3">
            <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-stone-800 truncate">{item.name}</div>
              <div className="text-sm text-stone-500">{item.price.toFixed(2)} ש&quot;ח</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
                className="w-7 h-7 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-50"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
                className="w-7 h-7 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-50"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="text-sm text-stone-400 hover:text-red-600 shrink-0"
            >
              הסרה
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-lg font-semibold text-stone-800 border-t border-stone-200 pt-4">
        <span>סה&quot;כ</span>
        <span>{totalPrice.toFixed(2)} ש&quot;ח</span>
      </div>

      <form action={createOrder} className="space-y-4 border-t border-stone-200 pt-6">
        <input type="hidden" name="cart" value={JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity })))} />
        <h2 className="font-medium text-stone-800">פרטי משלוח</h2>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">שם מלא</label>
          <input name="customerName" required className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">טלפון</label>
          <input name="customerPhone" type="tel" required className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">אימייל (אופציונלי)</label>
          <input name="customerEmail" type="email" className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">כתובת למשלוח (אופציונלי)</label>
          <input name="address" className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">הערות (אופציונלי)</label>
          <textarea name="notes" rows={2} className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm" />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 text-sm transition-colors"
        >
          שליחת הזמנה
        </button>
      </form>
    </div>
  );
}
