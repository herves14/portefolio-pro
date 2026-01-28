import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Ajouter le pathname aux headers pour le layout admin
  response.headers.set("x-pathname", request.nextUrl.pathname);
  
  return response;
}

export const config = {
  matcher: "/admin/:path*",
};
