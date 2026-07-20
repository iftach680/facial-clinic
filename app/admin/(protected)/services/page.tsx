import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteService } from "@/lib/actions/services";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-stone-800">טיפולים</h1>
        <Link
          href="/admin/services/new"
          className="rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 transition-colors"
        >
          טיפול חדש
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
        {services.length === 0 && (
          <p className="p-6 text-center text-sm text-stone-500">אין עדיין טיפולים</p>
        )}
        {services.map((service) => (
          <div key={service.id} className="flex items-center gap-4 p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-stone-800 truncate">{service.name}</span>
                {!service.active && (
                  <span className="text-xs bg-stone-100 text-stone-500 rounded-full px-2 py-0.5">מוסתר</span>
                )}
              </div>
              <div className="text-sm text-stone-500">
                {service.durationMin} דקות · {service.price.toFixed(2)} ש&quot;ח
              </div>
            </div>
            <Link
              href={`/admin/services/${service.id}`}
              className="text-sm text-rose-600 hover:text-rose-800 shrink-0"
            >
              עריכה
            </Link>
            <form action={deleteService.bind(null, service.id)}>
              <button type="submit" className="text-sm text-stone-400 hover:text-red-600 shrink-0">
                מחיקה
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
