import { prisma } from "@/lib/prisma";
import { updateOrderStatus } from "@/lib/actions/orders";

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "ממתין לתשלום",
  PAID: "שולם",
  FULFILLED: "נשלח/נמסר",
  CANCELLED: "בוטל",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  FULFILLED: "bg-sky-100 text-sky-700",
  CANCELLED: "bg-stone-100 text-stone-500",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-stone-800">הזמנות</h1>

      <div className="space-y-3">
        {orders.length === 0 && (
          <p className="bg-white rounded-xl border border-stone-200 p-6 text-center text-sm text-stone-500">
            אין עדיין הזמנות
          </p>
        )}
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[160px]">
                <div className="text-sm font-medium text-stone-800">{order.customerName}</div>
                <div className="text-xs text-stone-500">
                  {order.customerPhone}
                  {order.customerEmail ? ` · ${order.customerEmail}` : ""}
                </div>
                {order.address && <div className="text-xs text-stone-400 mt-0.5">{order.address}</div>}
              </div>
              <span className={`text-xs rounded-full px-2.5 py-1 ${STATUS_COLORS[order.status]}`}>
                {STATUS_LABELS[order.status]}
              </span>
              <div className="text-sm font-semibold text-stone-800">{order.total.toFixed(2)} ש&quot;ח</div>
            </div>

            <ul className="text-sm text-stone-600 border-t border-stone-100 pt-2 space-y-1">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} ש&quot;ח</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-1.5 flex-wrap">
              {order.status !== "PAID" && order.status !== "CANCELLED" && (
                <form action={updateOrderStatus.bind(null, order.id, "PAID")}>
                  <button className="text-xs rounded-full border border-emerald-300 text-emerald-700 px-2.5 py-1 hover:bg-emerald-50">
                    סימון כשולם
                  </button>
                </form>
              )}
              {order.status !== "FULFILLED" && order.status !== "CANCELLED" && (
                <form action={updateOrderStatus.bind(null, order.id, "FULFILLED")}>
                  <button className="text-xs rounded-full border border-sky-300 text-sky-700 px-2.5 py-1 hover:bg-sky-50">
                    נשלח/נמסר
                  </button>
                </form>
              )}
              {order.status !== "CANCELLED" && (
                <form action={updateOrderStatus.bind(null, order.id, "CANCELLED")}>
                  <button className="text-xs rounded-full border border-stone-300 text-stone-500 px-2.5 py-1 hover:bg-stone-50">
                    ביטול
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
