import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Basic security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  // Allow admin routes to check auth client side, but block obviously bad paths
  return res;
}

export const config = {
  matcher: ['/admin/:path*']
};
