import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CartProvider } from "@/lib/cart-context";
import { trackVisit } from "@/lib/track-visit";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  await trackVisit();

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}
