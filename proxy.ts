import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";


// proxy middleware
export async function proxy(request: NextRequest) {

  // skip the auth endpoints
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  // get is-ISR header
  const isISR = request.headers.get("is-ISR");
  if (isISR) {
    return NextResponse.next();
  }

  // get token from header or cookie
  const authHeader = request.headers.get("authorization");
  // get token from header
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

  // get token from cookie
  const cookieToken = request.cookies.get("token")?.value;
  // get token from header or cookie
  const token = bearerToken || cookieToken;

  // if no token, return 401
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }

  // verify token
  const decoded = await verifyToken(token);

  // if invalid token, return 401
  if (!decoded) {
    return NextResponse.json(
      { message: "Unauthorized: invalid token" },
      { status: 401 }
    );
  }

  // continue to next middleware
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
