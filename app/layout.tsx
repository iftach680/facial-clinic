import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "עסק הקוסמטיקה";

export const metadata: Metadata = {
  title: businessName,
  description: `${businessName} — קביעת תורים לטיפולים ורכישת מוצרי קוסמטיקה`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
