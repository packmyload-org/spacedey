import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyActionToken } from '@/lib/auth/actionTokens';
import { hashPassword } from '@/lib/auth/password';
import { validatePasswordStrength } from '@/lib/auth/passwordPolicy';
import { normalizeEmail } from '@/lib/utils/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body?.token).trim();
    const password = String(body?.password).trim();

    if (!token || !password) {
      return NextResponse.json(
        { ok: false, error: 'token and password are required.' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { ok: false, error: passwordValidation.message || 'Password is too weak.' },
        { status: 400 }
      );
    }

    const payload = verifyActionToken(token, 'password_reset');

    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'This password reset link is invalid or has expired.' },
        { status: 400 }
      );
    }

    if (!payload.email) {
      return NextResponse.json(
        { ok: false, error: 'This reset link contain an email address.' },
        { status: 500 }
      );
    }

    const supabase = createAdminClient();
    const { data: userRow, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('id', payload.userId)
      .eq('email', payload.email)
      .is('deletedAt', null)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!userRow) {
      return NextResponse.json(
        { ok: false, error: 'Account not found for this reset link.' },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ password: await hashPassword(password) })
      .eq('id', userRow.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      {
        ok: true,
        message: 'Password updated successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
