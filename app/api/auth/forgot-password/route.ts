import { NextResponse } from 'next/server';
import { sendResetPasswordToken, StoreganiseError } from '@/lib/integration/storeganise';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim();

    if (!email) {
      return NextResponse.json(
        { error: 'email is required.' },
        { status: 400 }
      );
    }

    const result = await sendResetPasswordToken(email);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    if (error instanceof StoreganiseError) {
      return NextResponse.json(
        { error: error.message, data: error.data },
        { status: error.status }
      );
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
