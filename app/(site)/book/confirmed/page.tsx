import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function BookConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) notFound();

  const appointment = await prisma.appointment.findUnique({ where: { id }, include: { service: true } });
  if (!appointment) notFound();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-5">
      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
        ✓
      </div>
      <h1 className="text-2xl font-semibold text-stone-800">התור נקבע בהצלחה!</h1>
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 text-sm text-stone-600 space-y-1 text-right">
        <p>
          <span className="text-stone-400">טיפול: </span>
          {appointment.service.name}
        </p>
        <p>
          <span className="text-stone-400">תאריך: </span>
          {appointment.date.toLocaleDateString("he-IL")}
        </p>
        <p>
          <span className="text-stone-400">שעה: </span>
          {appointment.date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      <p className="text-stone-500 text-sm">נשלח אישור, נתראה בקרוב!</p>
      <Link href="/" className="inline-block text-sm text-rose-600 hover:text-rose-800">
        חזרה לדף הבית
      </Link>
    </div>
  );
}
