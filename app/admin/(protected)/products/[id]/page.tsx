import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";
import { updateProduct } from "@/lib/actions/products";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const action = updateProduct.bind(null, id);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-stone-800">עריכת מוצר</h1>
      <ProductForm action={action} product={product} />
    </div>
  );
}
