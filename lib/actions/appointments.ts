"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/availability";

const BookingSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().min(1), // "YYYY-MM-DD"
  time: z.string().min(1), // "HH:mm"
  customerName: z.string().trim().min(2, "נא להזין שם מלא"),
  customerPhone: z.string().trim().min(9, "נא להזין מספר טלפון תקין"),
  notes: z.string().trim().optional().or(z.literal("")),
});

export async function createAppointment(formData: FormData) {
  const parsed = BookingSchema.safeParse({
    serviceId: formData.get("serviceId"),
    date: formData.get("date"),
    time: formData.get("time"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    redirect(`/book?serviceId=${formData.get("serviceId")}&error=invalid`);
  }

  const { serviceId, date, time, customerName, customerPhone, notes } = parsed.data;

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    redirect(`/book?error=service`);
  }

  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const appointmentDate = new Date(year, month - 1, day, hour, minute, 0, 0);
  const dayOnly = new Date(year, month - 1, day);

  // Re-check the slot is still free (guards against a double-booking race).
  const freeSlots = await getAvailableSlots(dayOnly, service!.durationMin);
  if (!freeSlots.includes(time)) {
    redirect(`/book?serviceId=${serviceId}&date=${date}&error=taken`);
  }

  const appointment = await prisma.appointment.create({
    data: {
      serviceId,
      date: appointmentDate,
      customerName,
      customerPhone,
      notes: notes || null,
      status: "PENDING",
    },
  });

  revalidatePath("/admin/appointments");
  redirect(`/book/confirmed?id=${appointment.id}`);
}

const StatusSchema = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]);

export async function updateAppointmentStatus(id: string, status: string) {
  const parsedStatus = StatusSchema.parse(status);
  await prisma.appointment.update({ where: { id }, data: { status: parsedStatus } });
  revalidatePath("/admin/appointments");
}
