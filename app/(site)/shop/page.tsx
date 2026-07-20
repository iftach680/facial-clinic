import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { active: true, stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl font-semibold text-stone-800">חנות</h1>

      {products.length === 0 ? (
        <p className="text-stone-500">אין כרגע מוצרים זמינים.</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-5">
          {products.map((product) => (
            <div key={product.id} className="rounded-xl border border-stone-200 overflow-hidden">
              <div className="aspect-square bg-stone-100">
                {product.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-medium text-stone-800">{product.name}</h3>
                <p className="text-sm text-stone-500 line-clamp-2">{product.description}</p>
                <p className="text-sm text-rose-600 font-medium">{product.price.toFixed(2)} ש&quot;ח</p>
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
