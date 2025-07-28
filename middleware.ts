import { NextRequest, NextResponse } from 'next/server';

/**
 * SIMPLIFIED MIDDLEWARE FOR TESTING
 * Temporarily disabled complex security features
 */
export async function middleware(request: NextRequest) {
  // Just pass through for now
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
