// Example Next.js middleware
import { NextResponse } from 'next/server';

export function middleware() {
  // Add custom logic here
  return NextResponse.next();
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware for details.