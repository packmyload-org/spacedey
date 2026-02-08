import { NextResponse } from 'next/server';
import { createUser, StoreganiseError } from '@/lib/integration/storeganise';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = String(body?.firstName || '').trim();
    const lastName = String(body?.lastName || '').trim();
    const email = String(body?.email || '').trim();
    const password = String(body?.password || '').trim();
    const recaptchaResponse = String(body?.recaptchaResponse || '').trim();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { ok: false, error: 'firstName, lastName, email, and password are required.' },
        { status: 400 }
      );
    }

    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
      recaptchaResponse: recaptchaResponse || undefined,
    });
    return NextResponse.json({ ok: true, user });
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
