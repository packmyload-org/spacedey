import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapUser } from '@/lib/db/mappers';
import { verifyActionToken } from '@/lib/auth/actionTokens';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body?.token || '').trim();

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'Verification token is required.' },
        { status: 400 }
      );
    }

    const payload = verifyActionToken(token, 'email_verification');

    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'This verification link is invalid or has expired.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: row, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .eq('email', payload.email)
      .is('deletedAt', null)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!row) {
      return NextResponse.json(
        { ok: false, error: 'Account not found for this verification link.' },
        { status: 404 }
      );
    }

    const user = mapUser(row);
    const alreadyVerified = Boolean(user.emailVerifiedAt);

    if (!alreadyVerified) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ emailVerifiedAt: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }
    }

    return NextResponse.json({
      ok: true,
      message: alreadyVerified ? 'Email already verified.' : 'Email verified successfully.',
      alreadyVerified,
    });
  } catch (error) {
    console.error('Verify email error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
