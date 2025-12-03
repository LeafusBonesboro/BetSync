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

  // REQUIRED: sync supabase session
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  const authPages = ["/login", "/register"];
  const protectedPages = ["/", "/bets", "/settings", "/chat"];

  // ----------------------------
  // NOT LOGGED IN → restrict protected pages
  // ----------------------------
  if (!user && protectedPages.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ----------------------------
  // LOGGED IN → block auth pages
  // ----------------------------
  if (user && authPages.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/bets";
    return NextResponse.redirect(url);
  }

  // ----------------------------
  // LOGGED IN → redirect "/" → "/bets"
  // ----------------------------
  if (user && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/bets";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
