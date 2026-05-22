import { NextResponse, NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapUser } from '@/lib/db/mappers';
import type { Database } from '@/lib/supabase/database.types';
import { requireAdmin } from '@/lib/auth/admin';
import { UserRole } from '@/lib/types/roles';
import { normalizeEmail } from '@/lib/utils/email';
import { sendSignupVerificationEmail } from '@/lib/email/resend';

function getEmailUnavailableMessage(user: { deletedAt: Date | null }) {
  return user.deletedAt
    ? 'This email belongs to a deactivated account. Restore the account to use this email again.'
    : 'Email already in use';
}

function formatUser(user: ReturnType<typeof mapUser>) {
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
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid user ID' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: row, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!row) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user: formatUser(mapUser(row)) });
  } catch (error) {
    console.error('Get user error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = await request.json();
    const firstName = typeof body?.firstName === 'string' ? body.firstName.trim() : undefined;
    const lastName = typeof body?.lastName === 'string' ? body.lastName.trim() : undefined;
    const role = body?.role;
    const email = normalizeEmail(body?.email || '');

    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid user ID' }, { status: 400 });
    }

    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { ok: false, error: `Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}` },
        { status: 400 }
      );
    }

    if (typeof body?.password !== 'undefined') {
      return NextResponse.json(
        { ok: false, error: 'Password updates are not allowed from this screen.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: row, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!row) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    const user = mapUser(row);

    if (user.id === adminCheck.userId && role === UserRole.USER) {
      return NextResponse.json(
        { ok: false, error: 'You cannot remove your own admin access.' },
        { status: 400 }
      );
    }

    let emailChanged = false;
    const updates: Database['public']['Tables']['users']['Update'] = {};

    if (email && email !== user.email) {
      const { data: existingRow } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (existingRow && existingRow.id !== user.id) {
        return NextResponse.json(
          { ok: false, error: getEmailUnavailableMessage(mapUser(existingRow)) },
          { status: 409 }
        );
      }

      updates.email = email;
      updates.emailVerifiedAt = null;
      emailChanged = true;
    }

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (role) updates.role = role;

    const { data: updatedRow, error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    const updatedUser = mapUser(updatedRow);
    let verificationEmailSent = false;

    if (emailChanged) {
      try {
        verificationEmailSent = await sendSignupVerificationEmail({
          userId: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          appUrl: new URL(request.url).origin,
        });
      } catch (mailError) {
        console.error('Admin update user verification email error:', mailError);
      }
    }

    return NextResponse.json({
      ok: true,
      user: formatUser(updatedUser),
      verificationEmailSent,
      requiresEmailVerification: emailChanged,
    });
  } catch (error) {
    console.error('Update user error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid user ID' }, { status: 400 });
    }

    if (id === adminCheck.userId) {
      return NextResponse.json(
        { ok: false, error: 'Cannot deactivate your own account' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: row, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!row) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    if (row.deletedAt) {
      return NextResponse.json(
        { ok: false, error: 'User is already deactivated.' },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from('users')
      .update({ deletedAt: new Date().toISOString() })
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      ok: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
