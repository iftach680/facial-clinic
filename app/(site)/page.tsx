import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TiltCard from "@/components/TiltCard";

export default async function HomePage() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "עסק הקוסמטיקה";

  const [services, products] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  return (
    <div>
      <section
        className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-rose-50/60 to-white"
        style={{ perspective: "1200px" }}
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-200/40 blur-3xl animate-[float_7s_ease-in-out_infinite]" />
        <div className="absolute top-40 -right-16 w-64 h-64 rounded-full bg-rose-100/60 blur-3xl animate-[float_9s_ease-in-out_infinite_1s]" />
        <div className="absolute bottom-10 left-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-rose-300/30 to-transparent blur-2xl animate-[float_5s_ease-in-out_infinite_0.5s]" />

        <div className="relative max-w-5xl mx-auto px-4 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-right space-y-6 order-2 md:order-1">
            <span className="inline-block text-xs font-medium tracking-wide text-rose-600 bg-rose-100 rounded-full px-3 py-1 shadow-sm">
              ✦ קליניקת יופי וטיפוח
            </span>
            <h1 className="text-3xl sm:text-5xl font-semibold text-stone-800 leading-tight [text-shadow:0_2px_0_rgba(255,255,255,0.8),0_10px_20px_rgba(225,29,72,0.12)]">
              {businessName}
            </h1>
            <p className="text-stone-500 max-w-md mx-auto md:mx-0 text-base sm:text-lg">
              טיפולי קוסמטיקה מקצועיים ומוצרי טיפוח איכותיים — קבעו תור או הזמינו אונליין.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <Link
                href="/book"
                className="rounded-full bg-rose-500 text-white font-medium px-7 py-3.5 text-sm shadow-[0_8px_0_0_#be123c,0_16px_24px_-8px_rgba(225,29,72,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_0_0_#be123c,0_20px_28px_-8px_rgba(225,29,72,0.55)] active:translate-y-1 active:shadow-[0_2px_0_0_#be123c,0_6px_10px_-4px_rgba(225,29,72,0.5)]"
              >
                קביעת תור
              </Link>
              <Link
                href="/shop"
                className="rounded-full bg-white border border-rose-200 text-rose-700 font-medium px-7 py-3.5 text-sm shadow-[0_6px_0_0_#fecdd3,0_10px_16px_-6px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-[0_1px_0_0_#fecdd3,0_4px_8px_-4px_rgba(0,0,0,0.1)]"
              >
                למעבר לחנות
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 relative max-w-xs mx-auto md:max-w-none">
            <TiltCard className="rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(225,29,72,0.4)] ring-1 ring-white/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://6zifcej6jec811b2.public.blob.vercel-storage.com/site/hero.jpg"
                alt={businessName}
                className="w-full h-full object-cover"
              />
            </TiltCard>
            <div
              className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-xl hidden sm:flex items-center justify-center text-white text-2xl"
              style={{ transform: "translateZ(40px)" }}
            >
              ✦
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
              <TiltCard
                key={service.id}
                className="rounded-2xl border border-stone-200 bg-white shadow-[0_8px_16px_-8px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_32px_-12px_rgba(225,29,72,0.25)] hover:border-rose-200"
              >
                <Link href={`/book?serviceId=${service.id}`} className="block p-4 sm:p-5">
                  <h3 className="font-medium text-stone-800 text-sm sm:text-base">{service.name}</h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 line-clamp-2 hidden sm:block">
                    {service.description}
                  </p>
                  <p className="text-xs sm:text-sm text-rose-600 mt-2 sm:mt-3 font-medium">
                    {service.durationMin} דקות · {service.price.toFixed(2)} ש&quot;ח
                  </p>
                </Link>
              </TiltCard>
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
              <TiltCard
                key={product.id}
                className="group rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-[0_8px_16px_-8px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_32px_-12px_rgba(225,29,72,0.25)]"
              >
                <Link href="/shop" className="block">
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
              </TiltCard>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
