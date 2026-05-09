import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key');

export async function middleware(req: NextRequest) {
  const token   = req.cookies.get('auth-token')?.value;
  const path    = req.nextUrl.pathname;
  const loginUrl = new URL('/login', req.url);

  /* ── Decode token ─────────────────────────────────────── */
  let decoded: any = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      decoded = payload;
    } catch {
      // expired / tampered token → treat as guest
    }
  }

  const isAuthenticated = !!decoded;
  const isAdmin         = decoded?.role === 'ADMIN';

  /* ── 1. Auth'd users on /login or /register ────────────
     Preserve the ?redirect param so we can still follow it,
     but skip if the user already has a destination          */
  if (isAuthenticated && (path.startsWith('/login') || path.startsWith('/register'))) {
    const redirectTo = req.nextUrl.searchParams.get('redirect');
    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
    // Default post-login destination per role
    return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/events', req.url));
  }

  /* ── 2. Protect /admin/* → ADMIN only ─────────────────── */
  if (path.startsWith('/admin')) {
    if (path === '/admin/login') {
      // Already authenticated admins don't need /admin/login
      if (isAdmin) return NextResponse.redirect(new URL('/admin', req.url));
      return NextResponse.next();
    }
    if (!isAdmin) {
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  /* ── 3. Protect /my-tickets → any authenticated user ──── */
  if (path.startsWith('/my-tickets')) {
    if (!isAuthenticated) {
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all routes EXCEPT:
   *  - Next.js internals (_next/static, _next/image)
   *  - favicon, public files
   * This ensures /my-tickets is handled without listing every route.
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|gallery|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
