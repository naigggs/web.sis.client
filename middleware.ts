import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "auth_session";
const ROLE_COOKIE = "user_role";

// Routes that are publicly accessible (the (auth) route group)
const PUBLIC_ROUTES = ["/login"];

// Route prefixes allowed per role (empty array = all routes allowed)
const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  student: ["/enrollment", "/profile"],
  staff: ["/grades"],
  admin: [], // all routes allowed
};

// Default landing page per role
const ROLE_DEFAULT_ROUTE: Record<string, string> = {
  student: "/enrollment",
  staff: "/grades",
  admin: "/dashboard",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has(SESSION_COOKIE);
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  // Redirect root to role default or login
  if (pathname === "/") {
    if (isAuthenticated && role) {
      return NextResponse.redirect(
        new URL(ROLE_DEFAULT_ROUTE[role] ?? "/dashboard", request.url),
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Redirect unauthenticated users away from protected routes
  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages to their role default
  if (isPublicRoute && isAuthenticated) {
    const defaultRoute = role
      ? (ROLE_DEFAULT_ROUTE[role] ?? "/dashboard")
      : "/dashboard";
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // Role-based route protection
  if (isAuthenticated && role && role in ROLE_ALLOWED_PREFIXES) {
    const allowedPrefixes = ROLE_ALLOWED_PREFIXES[role]!;
    if (allowedPrefixes.length > 0) {
      const isAllowed = allowedPrefixes.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
      );
      if (!isAllowed) {
        const defaultRoute = ROLE_DEFAULT_ROUTE[role] ?? "/dashboard";
        return NextResponse.redirect(new URL(defaultRoute, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, site.webmanifest, robots.txt
     * - public assets (png, jpg, svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|site.webmanifest|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|css|js)).*)",
  ],
};
