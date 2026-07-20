import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/availability";
import { createAppointment } from "@/lib/actions/appointments";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "נא למלא את כל השדות כראוי",
  service: "הטיפול שנבחר אינו זמין",
  taken: "השעה שבחרת נתפסה זה עתה, נא לבחור שעה אחרת",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ serviceId?: string; date?: string; time?: string; error?: string }>;
}) {
  const { serviceId, date, time, error } = await searchParams;

  const errorMessage = error ? ERROR_MESSAGES[error] : undefined;

  // Step 1: choose a service
  if (!serviceId) {
    const services = await prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" } });
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <h1 className="text-2xl font-semibold text-stone-800">קביעת תור</h1>
        <p className="text-stone-500">בחרו טיפול כדי להמשיך</p>
        {errorMessage && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{errorMessage}</p>}
        <div className="grid sm:grid-cols-2 gap-4">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/book?serviceId=${service.id}`}
              className="rounded-xl border border-stone-200 p-5 hover:border-rose-300 transition-colors"
            >
              <h3 className="font-medium text-stone-800">{service.name}</h3>
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{service.description}</p>
              <p className="text-sm text-rose-600 mt-3 font-medium">
                {service.durationMin} דקות · {service.price.toFixed(2)} ש&quot;ח
              </p>
            </Link>
          ))}
          {services.length === 0 && <p className="text-stone-500">אין כרגע טיפולים זמינים לקביעה</p>}
        </div>
      </div>
    );
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        <p className="text-red-600">הטיפול שנבחר אינו קיים או אינו זמין.</p>
        <Link href="/book" className="text-rose-600 hover:text-rose-800 text-sm">
          חזרה לבחירת טיפול
        </Link>
      </div>
    );
  }

  // Step 2: choose a date
  if (!date) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 space-y-6">
        <Link href="/book" className="text-sm text-rose-600 hover:text-rose-800">
          ← החלפת טיפול
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">{service.name}</h1>
          <p className="text-stone-500 mt-1">
            {service.durationMin} דקות · {service.price.toFixed(2)} ש&quot;ח
          </p>
        </div>
        {errorMessage && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{errorMessage}</p>}
        <form method="GET" action="/book" className="space-y-3">
          <input type="hidden" name="serviceId" value={serviceId} />
          <label className="text-sm font-medium text-stone-700 block">בחרו תאריך</label>
          <input
            type="date"
            name="date"
            required
            min={todayStr()}
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 text-sm transition-colors"
          >
            הצגת שעות פנויות
          </button>
        </form>
      </div>
    );
  }

  // Step 3: choose a time slot
  if (!time) {
    const [y, m, d] = date.split("-").map(Number);
    const slots = await getAvailableSlots(new Date(y, m - 1, d), service.durationMin);

    return (
      <div className="max-w-md mx-auto px-4 py-12 space-y-6">
        <Link href={`/book?serviceId=${serviceId}`} className="text-sm text-rose-600 hover:text-rose-800">
          ← בחירת תאריך אחר
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">{service.name}</h1>
          <p className="text-stone-500 mt-1">{new Date(y, m - 1, d).toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        {errorMessage && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{errorMessage}</p>}
        {slots.length === 0 ? (
          <p className="text-stone-500">אין תורים פנויים ביום זה. נסו לבחור תאריך אחר.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <Link
                key={slot}
                href={`/book?serviceId=${serviceId}&date=${date}&time=${slot}`}
                className="rounded-lg border border-stone-200 text-center py-2.5 text-sm text-stone-700 hover:border-rose-300 hover:text-rose-700 transition-colors"
              >
                {slot}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Step 4: contact details
  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <Link href={`/book?serviceId=${serviceId}&date=${date}`} className="text-sm text-rose-600 hover:text-rose-800">
        ← בחירת שעה אחרת
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">אישור פרטים</h1>
        <p className="text-stone-500 mt-1">
          {service.name} · {new Date(date).toLocaleDateString("he-IL")} בשעה {time}
        </p>
      </div>
      <form action={createAppointment} className="space-y-4">
        <input type="hidden" name="serviceId" value={serviceId} />
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="time" value={time} />
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">שם מלא</label>
          <input
            name="customerName"
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">טלפון</label>
          <input
            name="customerPhone"
            type="tel"
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">הערות (אופציונלי)</label>
          <textarea name="notes" rows={2} className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm" />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 text-sm transition-colors"
        >
          אישור קביעת תור
        </button>
      </form>
    </div>
  );
}
