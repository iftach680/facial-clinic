import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createSessionToken, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminCredentials(email, password)) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, { status: 303 });
  }

  const token = await createSessionToken(email);
  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return response;
}
