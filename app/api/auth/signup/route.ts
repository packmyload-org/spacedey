import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import User from '@/lib/db/entities/User';
import { mapUser } from '@/lib/db/mappers';
import { hashPassword } from '@/lib/auth/password';
import { sendSignupVerificationEmail } from '@/lib/email/resend';
import { validatePasswordStrength } from '@/lib/auth/passwordPolicy';
import { normalizeEmail } from '@/lib/utils/email';

function getEmailUnavailableMessage(user: User) {
  return user.deletedAt
    ? 'We found an inactive account with this email. Contact support and we will help you restore access.'
    : 'User with this email already exists.';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = String(body?.firstName || '').trim();
    const lastName = String(body?.lastName || '').trim();
    const email = normalizeEmail(body?.email || '');
    const password = String(body?.password || '').trim();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { ok: false, error: 'firstName, lastName, email, and password are required.' },
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

    const supabase = createAdminClient();
    const { data: existingRow, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (existingRow) {
      return NextResponse.json(
        { ok: false, error: getEmailUnavailableMessage(mapUser(existingRow)) },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const { data: newUserRow, error: insertError } = await supabase
      .from('users')
      .insert({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'user',
      })
      .select('*')
      .single();

    if (insertError) {
      throw insertError;
    }

    const newUser = mapUser(newUserRow);

    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      role: newUser.role,
      emailVerifiedAt: newUser.emailVerifiedAt ? newUser.emailVerifiedAt.toISOString() : null,
    };

    let verificationEmailSent = false;

    try {
      verificationEmailSent = await sendSignupVerificationEmail({
        userId: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        appUrl: new URL(request.url).origin,
      });
    } catch (mailError) {
      console.error('Signup verification email error:', mailError);
    }

    return NextResponse.json(
      {
        ok: true,
        user: userResponse,
        verificationEmailSent,
        requiresEmailVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
