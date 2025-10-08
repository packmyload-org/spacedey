// Example Next.js middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add custom logic here
  return NextResponse.next();
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware for details.