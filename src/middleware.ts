import { auth } from "@/auth";
import { ROUTES } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const checkRouteAuth = ROUTES.some((route) => {
    if (request.nextUrl.pathname === route.path && route.auth) {
      return true;
    }
  });

  const session = await auth();

  if (!session?.user && checkRouteAuth) {
    const newUrl = new URL("/signin", request.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
