import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import User from '@/lib/db/entities/User';
import { isResendConfigured, sendForgotPasswordEmail } from '@/lib/email/resend';
import { normalizeEmail } from '@/lib/utils/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body?.email || '');

    if (!email) {
      return NextResponse.json(
        { ok: false, error: 'email is required.' },
        { status: 400 }
      );
    }

    if (!isResendConfigured('forgotPassword')) {
      return NextResponse.json(
        { ok: false, error: 'Email service is not configured.' },
        { status: 503 }
      );
    }

    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(User);
    const user = await repo.findOne({ where: { email } });

    if (user) {
      await sendForgotPasswordEmail({
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
      });
    }

    return NextResponse.json(
      {
        ok: true,
        message: 'If an account exists for this email, a reset link has been sent.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
