import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define the dynamic route pattern
  const publicRoutePattern = /^\/dashboard\/[a-f0-9-]/;

  // Check if the requested path matches the public route pattern
  if (publicRoutePattern.test(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  const emailLinkError = "Email link is invalid or has expired";
  if (
    req.nextUrl.searchParams.get("error_description") === emailLinkError &&
    req.nextUrl.pathname !== "/auth/signup"
  ) {
    return NextResponse.redirect(
      new URL(
        `auth/signup?error_description=${req.nextUrl.searchParams.get(
          "error_description"
        )}`,
        req.url
      )
    );
  }

  if (["/auth/login", "/auth/signup"].includes(req.nextUrl.pathname)) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
  return res;
}
