import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken");
  const { pathname } = request.nextUrl;

  // ✅ PUBLIC ROUTES (MUST include redirect target)
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/unauthenticated",
  ];

  // Allow public pages
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Block unauthenticated users
  if (!refreshToken) {
    return NextResponse.redirect(
      new URL("/unauthenticated", request.url)
    );
  }

  return NextResponse.next();
}
