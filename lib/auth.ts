import { SignJWT, jwtVerify } from "jose";
import { createHash, timingSafeEqual } from "crypto";
import { SESSION_MAX_AGE_SECONDS } from "@/lib/session-constants";

export { SESSION_COOKIE } from "@/lib/session-constants";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET env var");
  return new TextEncoder().encode(secret);
}

// Constant-time-ish string comparison that also normalizes length via hashing,
// so differing password lengths don't leak through comparison timing.
function safeEqual(a: string, b: string) {
  const ah = createHash("sha256").update(a).digest();
  const bh = createHash("sha256").update(b).digest();
  return timingSafeEqual(ah, bh);
}

export function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminEmail || !adminPassword) return false;
  return safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase()) && safeEqual(password, adminPassword);
}

export async function createSessionToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { email: string };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
