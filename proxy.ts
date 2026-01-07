import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protège /dashboard/*
  const isDashboard = pathname.startsWith("/dashboard");

  // Auth.js / NextAuth v5 (et fallback v4)
  const token =
      req.cookies.get("authjs.session-token")?.value ??
      req.cookies.get("__Secure-authjs.session-token")?.value ??
      req.cookies.get("next-auth.session-token")?.value ??
      req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
