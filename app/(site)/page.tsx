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
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-rose-50/60 to-white">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute top-40 -right-16 w-64 h-64 rounded-full bg-rose-100/60 blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-4 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-right space-y-6 order-2 md:order-1">
            <span className="inline-block text-xs font-medium tracking-wide text-rose-600 bg-rose-100 rounded-full px-3 py-1">
              ✦ קליניקת יופי וטיפוח
            </span>
            <h1 className="text-3xl sm:text-5xl font-semibold text-stone-800 leading-tight">{businessName}</h1>
            <p className="text-stone-500 max-w-md mx-auto md:mx-0 text-base sm:text-lg">
              טיפולי קוסמטיקה מקצועיים ומוצרי טיפוח איכותיים — קבעו תור או הזמינו אונליין.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <Link
                href="/book"
                className="rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium px-7 py-3.5 text-sm shadow-lg shadow-rose-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                קביעת תור
              </Link>
              <Link
                href="/shop"
                className="rounded-full bg-white border border-rose-200 hover:border-rose-300 text-rose-700 font-medium px-7 py-3.5 text-sm transition-all hover:-translate-y-0.5"
              >
                למעבר לחנות
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 relative max-w-xs mx-auto md:max-w-none">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-rose-200/50 ring-1 ring-white/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://6zifcej6jec811b2.public.blob.vercel-storage.com/site/hero.jpg"
                alt={businessName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-12 sm:py-14">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-stone-800">הטיפולים שלנו</h2>
            <Link href="/book" className="text-sm text-rose-600 hover:text-rose-800">
              לכל הטיפולים
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/book?serviceId=${service.id}`}
                className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 transition-all hover:shadow-lg hover:shadow-stone-200/60 hover:-translate-y-0.5 hover:border-rose-200"
              >
                <h3 className="font-medium text-stone-800 text-sm sm:text-base">{service.name}</h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 line-clamp-2 hidden sm:block">
                  {service.description}
                </p>
                <p className="text-xs sm:text-sm text-rose-600 mt-2 sm:mt-3 font-medium">
                  {service.durationMin} דקות · {service.price.toFixed(2)} ש&quot;ח
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-12 sm:py-14 border-t border-stone-100">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-stone-800">מוצרים נבחרים</h2>
            <Link href="/shop" className="text-sm text-rose-600 hover:text-rose-800">
              לכל המוצרים
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href="/shop"
                className="group rounded-2xl border border-stone-200 bg-white overflow-hidden transition-all hover:shadow-lg hover:shadow-stone-200/60 hover:-translate-y-0.5"
              >
                <div className="aspect-square bg-stone-100 overflow-hidden">
                  {product.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-stone-800 text-sm sm:text-base line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-rose-600 mt-1 font-semibold">{product.price.toFixed(2)} ש&quot;ח</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
