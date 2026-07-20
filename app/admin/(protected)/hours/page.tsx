import { prisma } from "@/lib/prisma";
import { updateBusinessHours, addBlockedDate, deleteBlockedDate } from "@/lib/actions/hours";

const WEEKDAY_LABELS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export default async function AdminHoursPage() {
  const hours = await prisma.businessHours.findMany({ orderBy: { weekday: "asc" } });
  const hoursByDay = new Map(hours.map((h) => [h.weekday, h]));
  const blockedDates = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-lg font-semibold text-stone-800">שעות פעילות שבועיות</h1>
        <form action={updateBusinessHours} className="bg-white rounded-xl border border-stone-200 p-6 space-y-3 max-w-2xl">
          {WEEKDAY_LABELS.map((label, weekday) => {
            const h = hoursByDay.get(weekday);
            return (
              <div key={weekday} className="flex items-center gap-3 flex-wrap">
                <span className="w-14 text-sm font-medium text-stone-700">{label}</span>
                <input
                  type="time"
                  name={`startTime-${weekday}`}
                  defaultValue={h?.startTime ?? "09:00"}
                  className="rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
                />
                <span className="text-stone-400 text-sm">עד</span>
                <input
                  type="time"
                  name={`endTime-${weekday}`}
                  defaultValue={h?.endTime ?? "18:00"}
                  className="rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
                />
                <label className="flex items-center gap-1.5 text-sm text-stone-500 mr-auto">
                  <input
                    type="checkbox"
                    name={`closed-${weekday}`}
                    defaultChecked={h?.closed ?? false}
                    className="rounded border-stone-300"
                  />
                  סגור
                </label>
              </div>
            );
          })}
          <button
            type="submit"
            className="rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
          >
            שמירת שעות
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">ימים חסומים (חגים / חופשה)</h2>
        <form action={addBlockedDate} className="bg-white rounded-xl border border-stone-200 p-4 flex items-end gap-3 flex-wrap max-w-2xl">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-700">תאריך</label>
            <input
              type="date"
              name="date"
              required
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <label className="text-sm font-medium text-stone-700">סיבה (אופציונלי)</label>
            <input
              type="text"
              name="reason"
              placeholder="לדוגמה: חג"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-stone-800 hover:bg-stone-900 text-white text-sm font-medium px-4 py-2.5 transition-colors"
          >
            הוספה
          </button>
        </form>

        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 max-w-2xl">
          {blockedDates.length === 0 && (
            <p className="p-6 text-center text-sm text-stone-500">אין ימים חסומים</p>
          )}
          {blockedDates.map((bd) => (
            <div key={bd.id} className="flex items-center gap-4 p-4">
              <span className="text-sm font-medium text-stone-800">
                {bd.date.toLocaleDateString("he-IL")}
              </span>
              {bd.reason && <span className="text-sm text-stone-500 flex-1">{bd.reason}</span>}
              <form action={deleteBlockedDate.bind(null, bd.id)} className="mr-auto">
                <button type="submit" className="text-sm text-stone-400 hover:text-red-600">
                  הסרה
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
