import { NextResponse, NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapUser } from '@/lib/db/mappers';
import { requireAdmin } from '@/lib/auth/admin';
import { UserRole } from '@/lib/types/roles';
import { hashPassword } from '@/lib/auth/password';
import { validatePasswordStrength } from '@/lib/auth/passwordPolicy';
import { normalizeEmail } from '@/lib/utils/email';
import { sendSignupVerificationEmail } from '@/lib/email/resend';

function getEmailUnavailableMessage(user: { deletedAt: Date | null }) {
  return user.deletedAt
    ? 'This email belongs to a deactivated account. Restore the account to use this email again.'
    : 'User with this email already exists.';
}

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
    const pageSize = Math.min(50, Math.max(1, Number.parseInt(searchParams.get('pageSize') || '10', 10) || 10));
    const search = String(searchParams.get('search') || '').trim().toLowerCase();
    const supabase = createAdminClient();

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('deletedAt', { ascending: true, nullsFirst: true })
      .order('createdAt', { ascending: false })
      .order('email', { ascending: true });

    if (search) {
      query = query.or(
        `email.ilike.%${search}%,firstName.ilike.%${search}%,lastName.ilike.%${search}%`
      );
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data: rows, error, count } = await query.range(from, to);

    if (error) {
      throw error;
    }

    const total = count ?? 0;
    const formattedUsers = (rows ?? []).map((row) => {
      const user = mapUser(row);
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt ? user.deletedAt.toISOString() : null,
      };
    });

    return NextResponse.json({
      ok: true,
      users: formattedUsers,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error) {
    console.error('Get users error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = await request.json();
    const firstName = String(body?.firstName || '').trim();
    const lastName = String(body?.lastName || '').trim();
    const password = String(body?.password || '').trim();
    const role = body?.role;
    const email = normalizeEmail(body?.email || '');

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

    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { ok: false, error: `Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: existingRow } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingRow) {
      return NextResponse.json(
        { ok: false, error: getEmailUnavailableMessage(mapUser(existingRow)) },
        { status: 409 }
      );
    }

    const { data: newUserRow, error } = await supabase
      .from('users')
      .insert({
        firstName,
        lastName,
        email,
        password: await hashPassword(password),
        role: (role || UserRole.USER) as 'admin' | 'user',
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    const newUser = mapUser(newUserRow);
    let verificationEmailSent = false;

    try {
      verificationEmailSent = await sendSignupVerificationEmail({
        userId: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        appUrl: new URL(request.url).origin,
      });
    } catch (mailError) {
      console.error('Admin create user verification email error:', mailError);
    }

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
          role: newUser.role,
          emailVerifiedAt: newUser.emailVerifiedAt ? newUser.emailVerifiedAt.toISOString() : null,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
        verificationEmailSent,
        requiresEmailVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
