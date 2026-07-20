"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const ServiceSchema = z.object({
  name: z.string().trim().min(1, "שם חובה"),
  description: z.string().trim().default(""),
  durationMin: z.coerce.number().int().min(5, "משך מינימלי 5 דקות"),
  price: z.coerce.number().min(0, "מחיר לא יכול להיות שלילי"),
  active: z.coerce.boolean().default(true),
});

export async function createService(formData: FormData) {
  const data = ServiceSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    durationMin: formData.get("durationMin"),
    price: formData.get("price"),
    active: formData.get("active") === "on",
  });

  await prisma.service.create({ data });

  revalidatePath("/admin/services");
  revalidatePath("/book");
  redirect("/admin/services");
}

export async function updateService(id: string, formData: FormData) {
  const data = ServiceSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    durationMin: formData.get("durationMin"),
    price: formData.get("price"),
    active: formData.get("active") === "on",
  });

  await prisma.service.update({ where: { id }, data });

  revalidatePath("/admin/services");
  revalidatePath("/book");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({ where: { id } });
  } catch {
    // Service has existing appointments — can't hard-delete, hide it instead.
    await prisma.service.update({ where: { id }, data: { active: false } });
  }
  revalidatePath("/admin/services");
  revalidatePath("/book");
}
