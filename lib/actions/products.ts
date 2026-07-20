"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const ProductSchema = z.object({
  name: z.string().trim().min(1, "שם חובה"),
  description: z.string().trim().default(""),
  price: z.coerce.number().min(0, "מחיר לא יכול להיות שלילי"),
  stock: z.coerce.number().int().min(0, "מלאי לא יכול להיות שלילי"),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  active: z.coerce.boolean().default(true),
});

export async function createProduct(formData: FormData) {
  const data = ProductSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
    active: formData.get("active") === "on",
  });

  await prisma.product.create({
    data: { ...data, imageUrl: data.imageUrl || null },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const data = ProductSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
    active: formData.get("active") === "on",
  });

  await prisma.product.update({
    where: { id },
    data: { ...data, imageUrl: data.imageUrl || null },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    // Product has existing order history — can't hard-delete, hide it instead.
    await prisma.product.update({ where: { id }, data: { active: false } });
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
