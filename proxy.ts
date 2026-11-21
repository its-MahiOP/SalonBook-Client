import { NextResponse, type NextRequest } from "next/server"

const SESSION_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
]

/**
 * Fast edge guard for private areas. The dashboard layouts still verify the
 * session and role on the server, so this only improves the first paint and
 * avoids flashing dashboard chrome to signed-out visitors.
 */
export function proxy(request: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name))

  if (!hasSession) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/success"],
}
