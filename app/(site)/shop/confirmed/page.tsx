import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ClearCartOnMount from "@/components/ClearCartOnMount";

export default async function ShopConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) notFound();

  const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
  if (!order) notFound();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-5">
      <ClearCartOnMount />
      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
        ✓
      </div>
      <h1 className="text-2xl font-semibold text-stone-800">ההזמנה התקבלה!</h1>
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 text-sm text-stone-600 space-y-2 text-right">
        <ul className="space-y-1">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>{(item.price * item.quantity).toFixed(2)} ש&quot;ח</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-semibold text-stone-800 border-t border-stone-200 pt-2">
          <span>סה&quot;כ</span>
          <span>{order.total.toFixed(2)} ש&quot;ח</span>
        </div>
      </div>
      <p className="text-stone-500 text-sm">התשלום מתבצע במקום / בהעברה בנקאית לפי תיאום עם העסק. ניצור קשר בהקדם!</p>
      <Link href="/" className="inline-block text-sm text-rose-600 hover:text-rose-800">
        חזרה לדף הבית
      </Link>
    </div>
  );
}
