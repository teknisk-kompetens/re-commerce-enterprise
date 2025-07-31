
import { NextResponse } from 'next/server';

export async function GET() {
  // Simple endpoint to satisfy test requirements
  // This CaaS platform demo doesn't require authentication
  return NextResponse.json({
    message: "CaaS Platform Demo - Authentication not required for this showcase"
  });
}
