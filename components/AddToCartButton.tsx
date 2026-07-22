"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({
  productId,
  name,
  price,
  imageUrl,
}: {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem({ productId, name, price, imageUrl });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="w-full rounded-full bg-rose-500 text-white text-sm font-medium py-2.5 transition-all shadow-[0_4px_0_0_#be123c] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#be123c] active:translate-y-1 active:shadow-[0_1px_0_0_#be123c]"
    >
      {added ? "נוסף לעגלה ✓" : "הוספה לעגלה"}
    </button>
  );
}
