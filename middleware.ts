import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only run Supabase session refresh where auth actually matters —
  // running it site-wide costs a Supabase auth API call on every public page view.
  matcher: ["/dashboard/:path*", "/prijava"],
};
