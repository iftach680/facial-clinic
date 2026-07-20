export default function SiteFooter() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "עסק הקוסמטיקה";
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE;

  return (
    <footer className="border-t border-rose-100 bg-rose-50/50 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-sm text-stone-500 space-y-1">
        <p className="font-medium text-stone-700">{businessName}</p>
        {phone && <p>טלפון: {phone}</p>}
        <p className="text-stone-400">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
