import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "@/lib/actions/products";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-stone-800">מוצרים</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 transition-colors"
        >
          מוצר חדש
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
        {products.length === 0 && (
          <p className="p-6 text-center text-sm text-stone-500">אין עדיין מוצרים</p>
        )}
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-4">
            <div className="w-14 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0">
              {product.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-stone-800 truncate">{product.name}</span>
                {!product.active && (
                  <span className="text-xs bg-stone-100 text-stone-500 rounded-full px-2 py-0.5">מוסתר</span>
                )}
              </div>
              <div className="text-sm text-stone-500">
                {product.price.toFixed(2)} ש&quot;ח · מלאי: {product.stock}
              </div>
            </div>
            <Link
              href={`/admin/products/${product.id}`}
              className="text-sm text-rose-600 hover:text-rose-800 shrink-0"
            >
              עריכה
            </Link>
            <form action={deleteProduct.bind(null, product.id)}>
              <button type="submit" className="text-sm text-stone-400 hover:text-red-600 shrink-0">
                מחיקה
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
