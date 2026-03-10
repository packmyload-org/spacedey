import { NextResponse } from 'next/server';
import { env } from '@/config/env';

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: 'auth-token',
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: env.app.isProduction,
    path: '/',
    maxAge: 0,
  });

  return response;
}
