import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hasRefreshToken = request.cookies.has("refreshToken");
  const { pathname } = request.nextUrl;

  // Public pages
  const publicPaths = ["/", "/login", "/register"];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // If user is NOT authenticated, block everything else
  if (!hasRefreshToken) {
    return NextResponse.redirect(
      new URL("/unauthenticated", request.url)
    );
  }

  return NextResponse.next();
}
