"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createPayment } from "@/lib/payments";
import { sendPushToAll } from "@/lib/push";

const CartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});

const CheckoutSchema = z.object({
  customerName: z.string().trim().min(2, "נא להזין שם מלא"),
  customerPhone: z.string().trim().min(9, "נא להזין מספר טלפון תקין"),
  customerEmail: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
  cart: z.array(CartItemSchema).min(1, "העגלה ריקה"),
});

export async function createOrder(formData: FormData) {
  const cartRaw = String(formData.get("cart") ?? "[]");
  let cart: unknown;
  try {
    cart = JSON.parse(cartRaw);
  } catch {
    cart = [];
  }

  const parsed = CheckoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
    address: formData.get("address"),
    notes: formData.get("notes"),
    cart,
  });

  if (!parsed.success) {
    redirect("/shop/cart?error=invalid");
  }

  const { customerName, customerPhone, customerEmail, address, notes, cart: items } = parsed.data;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, active: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  let total = 0;
  const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product || product.stock < item.quantity) {
      redirect("/shop/cart?error=stock");
    }
    total += product!.price * item.quantity;
    orderItemsData.push({
      productId: product!.id,
      quantity: item.quantity,
      price: product!.price,
    });
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        address: address || null,
        notes: notes || null,
        total,
        status: "PENDING_PAYMENT",
        items: { create: orderItemsData },
      },
    });

    for (const item of orderItemsData) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  await createPayment(order.id, total);

  revalidatePath("/admin/orders");

  await sendPushToAll({
    title: "הזמנה חדשה התקבלה",
    body: `${customerName} · ${total.toFixed(2)} ש"ח`,
    url: "/admin/orders",
  }).catch(() => {});

  redirect(`/shop/confirmed?id=${order.id}`);
}

const OrderStatusSchema = z.enum(["PENDING_PAYMENT", "PAID", "FULFILLED", "CANCELLED"]);

export async function updateOrderStatus(id: string, status: string) {
  const parsedStatus = OrderStatusSchema.parse(status);
  await prisma.order.update({ where: { id }, data: { status: parsedStatus } });
  revalidatePath("/admin/orders");
}
