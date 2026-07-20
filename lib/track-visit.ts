import { headers } from "next/headers";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";

// Records a simple visit count, skipping Next.js route prefetches so hover/
// scroll-into-view prefetching doesn't inflate the number. Runs after the
// response is sent so it never slows the page down.
export async function trackVisit() {
  const h = await headers();
  const isPrefetch =
    h.get("next-router-prefetch") === "1" || (h.get("sec-purpose") ?? "").includes("prefetch");
  if (isPrefetch) return;

  after(() => prisma.pageView.create({ data: {} }).catch(() => {}));
}
