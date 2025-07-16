import { NextRequest, NextResponse } from 'next/server';

// Simplified middleware for testing navigation
export async function middleware(request: NextRequest) {
  try {
    // Simple request logging without Prisma
    console.log(`Request: ${request.method} ${request.url}`);
    
    // Allow all requests to pass through for testing
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Apply to all routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
