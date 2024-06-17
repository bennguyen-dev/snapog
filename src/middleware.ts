import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-current-path", request.nextUrl.pathname);

  return response;
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
