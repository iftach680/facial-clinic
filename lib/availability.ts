import { prisma } from "@/lib/prisma";

const SLOT_STEP_MIN = 30;

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseTimeOnDate(date: Date, hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Returns available "HH:mm" start times for a service of the given duration
 * on the given date, based on configured business hours, blocked dates, and
 * existing (non-cancelled) appointments.
 */
export async function getAvailableSlots(date: Date, serviceDurationMin: number): Promise<string[]> {
  const day = startOfDay(date);
  const weekday = day.getDay();

  const hours = await prisma.businessHours.findUnique({ where: { weekday } });
  if (!hours || hours.closed) return [];

  const blocked = await prisma.blockedDate.findFirst({
    where: {
      date: {
        gte: day,
        lt: new Date(day.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });
  if (blocked) return [];

  const dayStart = parseTimeOnDate(day, hours.startTime);
  const dayEnd = parseTimeOnDate(day, hours.endTime);

  const existing = await prisma.appointment.findMany({
    where: {
      status: { not: "CANCELLED" },
      date: { gte: day, lt: new Date(day.getTime() + 24 * 60 * 60 * 1000) },
    },
    include: { service: true },
  });

  const busyIntervals = existing.map((a) => ({
    start: a.date,
    end: new Date(a.date.getTime() + a.service.durationMin * 60000),
  }));

  const now = new Date();
  const isToday = isSameDay(day, now);

  const slots: string[] = [];
  for (
    let slotStart = new Date(dayStart);
    slotStart.getTime() + serviceDurationMin * 60000 <= dayEnd.getTime();
    slotStart = new Date(slotStart.getTime() + SLOT_STEP_MIN * 60000)
  ) {
    const slotEnd = new Date(slotStart.getTime() + serviceDurationMin * 60000);

    if (isToday && slotStart <= now) continue;

    const conflict = busyIntervals.some((b) => overlaps(slotStart, slotEnd, b.start, b.end));
    if (conflict) continue;

    const hh = String(slotStart.getHours()).padStart(2, "0");
    const mm = String(slotStart.getMinutes()).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }

  return slots;
}
