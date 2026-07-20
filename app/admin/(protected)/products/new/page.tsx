import ProductForm from "../ProductForm";
import { createProduct } from "@/lib/actions/products";

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-stone-800">מוצר חדש</h1>
      <ProductForm action={createProduct} />
    </div>
  );
}
