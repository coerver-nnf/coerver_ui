import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard is Croatian-only — strip locale prefixes
  const dashboardMatch = pathname.match(/^\/(?:sl|en)(\/dashboard(?:\/.*)?)$/);
  if (dashboardMatch) {
    return NextResponse.redirect(new URL(dashboardMatch[1], request.url));
  }

  const response = intlMiddleware(request);

  // Only run Supabase session refresh where auth actually matters —
  // running it site-wide costs a Supabase auth API call on every public page view.
  if (/^\/(?:(?:sl|en)\/)?(?:dashboard|prijava)(?:\/|$)/.test(pathname)) {
    return await updateSession(request, response);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|auth|og-image|_next|_vercel|.*\\..*).*)"],
};
