import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "עסק הקוסמטיקה";

  return {
    name: businessName,
    short_name: businessName,
    description: "קביעת תורים ורכישת מוצרים",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f43f5e",
    dir: "rtl",
    lang: "he",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
