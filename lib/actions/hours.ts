"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const HoursSchema = z.object({
  weekday: z.coerce.number().int().min(0).max(6),
  startTime: z.string().trim().min(1),
  endTime: z.string().trim().min(1),
  closed: z.coerce.boolean().default(false),
});

export async function updateBusinessHours(formData: FormData) {
  for (let weekday = 0; weekday <= 6; weekday++) {
    const data = HoursSchema.parse({
      weekday,
      startTime: formData.get(`startTime-${weekday}`) || "09:00",
      endTime: formData.get(`endTime-${weekday}`) || "18:00",
      closed: formData.get(`closed-${weekday}`) === "on",
    });

    await prisma.businessHours.upsert({
      where: { weekday },
      update: data,
      create: data,
    });
  }

  revalidatePath("/admin/hours");
  revalidatePath("/book");
}

const BlockedDateSchema = z.object({
  date: z.coerce.date(),
  reason: z.string().trim().optional().or(z.literal("")),
});

export async function addBlockedDate(formData: FormData) {
  const data = BlockedDateSchema.parse({
    date: formData.get("date"),
    reason: formData.get("reason"),
  });

  await prisma.blockedDate.create({ data: { date: data.date, reason: data.reason || null } });

  revalidatePath("/admin/hours");
  revalidatePath("/book");
}

export async function deleteBlockedDate(id: string) {
  await prisma.blockedDate.delete({ where: { id } });
  revalidatePath("/admin/hours");
  revalidatePath("/book");
}
