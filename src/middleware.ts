import { auth } from "@/auth";
import { ROUTES } from "@/lib/constants";
import { NextResponse } from "next/server";

export const runtime = "edge";

export default auth((request) => {
  const checkRouteAuth = ROUTES.some((route) => {
    if (request.nextUrl.pathname === route.path && route.auth) {
      return true;
    }
  });

  if (!request.auth && checkRouteAuth) {
    const newUrl = new URL("/signin", request.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
