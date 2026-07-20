import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "עסק הקוסמטיקה";

  const [services, products] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-stone-800">{businessName}</h1>
          <p className="text-stone-500 max-w-md mx-auto">
            טיפולי קוסמטיקה מקצועיים ומוצרי טיפוח איכותיים — קבעו תור או הזמינו אונליין.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/book"
              className="rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-3 text-sm transition-colors"
            >
              קביעת תור
            </Link>
            <Link
              href="/shop"
              className="rounded-full bg-white border border-rose-200 hover:border-rose-300 text-rose-700 font-medium px-6 py-3 text-sm transition-colors"
            >
              למעבר לחנות
            </Link>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-stone-800">הטיפולים שלנו</h2>
            <Link href="/book" className="text-sm text-rose-600 hover:text-rose-800">
              לכל הטיפולים
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/book?serviceId=${service.id}`}
                className="rounded-xl border border-stone-200 p-5 hover:border-rose-300 transition-colors"
              >
                <h3 className="font-medium text-stone-800">{service.name}</h3>
                <p className="text-sm text-stone-500 mt-1 line-clamp-2">{service.description}</p>
                <p className="text-sm text-rose-600 mt-3 font-medium">
                  {service.durationMin} דקות · {service.price.toFixed(2)} ש&quot;ח
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-14 border-t border-stone-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-stone-800">מוצרים נבחרים</h2>
            <Link href="/shop" className="text-sm text-rose-600 hover:text-rose-800">
              לכל המוצרים
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href="/shop"
                className="rounded-xl border border-stone-200 overflow-hidden hover:border-rose-300 transition-colors"
              >
                <div className="aspect-square bg-stone-100">
                  {product.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-stone-800">{product.name}</h3>
                  <p className="text-sm text-rose-600 mt-1 font-medium">{product.price.toFixed(2)} ש&quot;ח</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
