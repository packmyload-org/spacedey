import { NextResponse } from 'next/server';
import { resetPassword, StoreganiseError } from '@/lib/integration/storeganise';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body?.token || '').trim();
    const email = String(body?.email || '').trim();
    const password = String(body?.password || '').trim();

    if (!token || !email || !password) {
      return NextResponse.json(
        { ok: false, error: 'token, email, and password are required.' },
        { status: 400 }
      );
    }

    const result = await resetPassword({ token, email, password });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    if (error instanceof StoreganiseError) {
      return NextResponse.json(
        { ok: false, error: error.message, data: error.data },
        { status: error.status }
      );
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
