import { prisma } from "@/lib/prisma";
import { updateAppointmentStatus } from "@/lib/actions/appointments";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "ממתין",
  CONFIRMED: "מאושר",
  CANCELLED: "בוטל",
  COMPLETED: "הושלם",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-stone-100 text-stone-500",
  COMPLETED: "bg-sky-100 text-sky-700",
};

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: { service: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-stone-800">תורים</h1>

      <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
        {appointments.length === 0 && (
          <p className="p-6 text-center text-sm text-stone-500">אין עדיין תורים</p>
        )}
        {appointments.map((appt) => (
          <div key={appt.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-[110px]">
              <div className="text-sm font-medium text-stone-800">
                {appt.date.toLocaleDateString("he-IL")}
              </div>
              <div className="text-xs text-stone-500">
                {appt.date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <div className="flex-1 min-w-[160px]">
              <div className="text-sm font-medium text-stone-800">{appt.service.name}</div>
              <div className="text-xs text-stone-500">
                {appt.customerName} · {appt.customerPhone}
              </div>
              {appt.notes && <div className="text-xs text-stone-400 mt-0.5">{appt.notes}</div>}
            </div>
            <span className={`text-xs rounded-full px-2.5 py-1 ${STATUS_COLORS[appt.status]}`}>
              {STATUS_LABELS[appt.status]}
            </span>
            <div className="flex gap-1.5">
              {appt.status !== "CONFIRMED" && appt.status !== "CANCELLED" && (
                <form action={updateAppointmentStatus.bind(null, appt.id, "CONFIRMED")}>
                  <button className="text-xs rounded-full border border-emerald-300 text-emerald-700 px-2.5 py-1 hover:bg-emerald-50">
                    אישור
                  </button>
                </form>
              )}
              {appt.status !== "COMPLETED" && appt.status !== "CANCELLED" && (
                <form action={updateAppointmentStatus.bind(null, appt.id, "COMPLETED")}>
                  <button className="text-xs rounded-full border border-sky-300 text-sky-700 px-2.5 py-1 hover:bg-sky-50">
                    הושלם
                  </button>
                </form>
              )}
              {appt.status !== "CANCELLED" && (
                <form action={updateAppointmentStatus.bind(null, appt.id, "CANCELLED")}>
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
