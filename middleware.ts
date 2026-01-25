import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hasRefreshToken = request.cookies.has("refresh_token");
  const { pathname } = request.nextUrl;

  // Always allow public routes
  const publicPaths = ["/login", "/home", "/unauthenticated"];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Protect these routes
  const protectedRoutes = ["/myprofile", "/profile"];
  if (!hasRefreshToken && protectedRoutes.some((path) => pathname.startsWith(path))) {
    // Redirect to unauthenticated page
    return NextResponse.redirect(new URL("/unauthenticated", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/myprofile/:path*", "/profile/:path*","/blog/:path*"],
};
