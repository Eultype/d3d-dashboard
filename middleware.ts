import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    if (!isDashboard) return NextResponse.next();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET });
    if (token) return NextResponse.next();

    return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
