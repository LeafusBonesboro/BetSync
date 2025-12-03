import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value }) =>
            supabaseResponse.cookies.set(name, value)
          );
        },
      },
    }
  );

  // Required by Supabase SSR — do NOT remove
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  // Routes accessible only to logged-out users
  const authPages = ["/login", "/register"];

  // Pages that REQUIRE login
  const protectedPages = ["/bets", "/settings", "/chat"];

  /* ----------------------------------------------------
   * 1. NOT LOGGED IN — allow "/", login, register
   * -------------------------------------------------- */
  if (!user) {
    // If a logged-out user attempts to access protected pages → redirect to login
    if (protectedPages.includes(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Allow "/" (landing), "/login", "/register", and all public assets
    return supabaseResponse;
  }

  /* ----------------------------------------------------
   * 2. LOGGED IN — redirect "/" → "/bets"
   * -------------------------------------------------- */
  if (user && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/bets";
    return NextResponse.redirect(url);
  }

  /* ----------------------------------------------------
   * 3. LOGGED IN — block /login & /register
   * -------------------------------------------------- */
  if (user && authPages.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/bets";
    return NextResponse.redirect(url);
  }

  /* ----------------------------------------------------
   * 4. LOGGED IN — allow protected pages normally
   * -------------------------------------------------- */
  return supabaseResponse;
}
