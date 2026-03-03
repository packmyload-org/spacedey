import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: 'email is required.' },
        { status: 400 }
      );
    }

    // TODO: Implement forgot password with email sending
    // This would involve:
    // 1. Finding user by email
    // 2. Generating a reset token
    // 3. Storing token with expiration in database
    // 4. Sending email with reset link

    return NextResponse.json(
      {
        ok: false,
        error: 'Forgot password functionality is not yet implemented. Please contact support.',
      },
      { status: 501 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
