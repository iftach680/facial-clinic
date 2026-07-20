import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { active: true, stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-12 space-y-6">
      <div className="text-center sm:text-right space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-stone-800">חנות</h1>
        <p className="text-stone-500 text-sm">מוצרי טיפוח מקצועיים לשימוש בבית</p>
      </div>

      {products.length === 0 ? (
        <p className="text-stone-500">אין כרגע מוצרים זמינים.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="group rounded-2xl border border-stone-200 bg-white overflow-hidden transition-all hover:shadow-lg hover:shadow-stone-200/60 hover:-translate-y-0.5"
            >
              <div className="aspect-square bg-stone-100 overflow-hidden relative">
                {product.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                <h3 className="font-medium text-stone-800 text-sm sm:text-base line-clamp-1">{product.name}</h3>
                <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 hidden sm:block">
                  {product.description}
                </p>
                <p className="text-sm sm:text-base text-rose-600 font-semibold">
                  {product.price.toFixed(2)} ש&quot;ח
                </p>
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
