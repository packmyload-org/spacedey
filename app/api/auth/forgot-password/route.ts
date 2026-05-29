import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapUser } from '@/lib/db/mappers';
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

    const supabase = createAdminClient();
    const { data: row, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .is('deletedAt', null)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const user = row ? mapUser(row) : null;

    if (user) {
      await sendForgotPasswordEmail({
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        appUrl: new URL(request.url).origin,
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
