import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapUser } from '@/lib/db/mappers';
import { requireAdmin } from '@/lib/auth/admin';

export async function POST(
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
      return NextResponse.json(
        { ok: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: userRow, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!userRow) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (!userRow.deletedAt) {
      return NextResponse.json(
        { ok: false, error: 'User is already active.' },
        { status: 400 }
      );
    }

    const { data: restoredRow, error: restoreError } = await supabase
      .from('users')
      .update({ deletedAt: null })
      .eq('id', id)
      .select('*')
      .single();

    if (restoreError) {
      throw restoreError;
    }

    const restoredUser = mapUser(restoredRow);

    return NextResponse.json({
      ok: true,
      message: 'User restored successfully',
      user: {
        id: restoredUser.id,
        email: restoredUser.email,
        firstName: restoredUser.firstName,
        lastName: restoredUser.lastName,
        phone: restoredUser.phone,
        role: restoredUser.role,
        emailVerifiedAt: restoredUser.emailVerifiedAt ? restoredUser.emailVerifiedAt.toISOString() : null,
        createdAt: restoredUser.createdAt,
        updatedAt: restoredUser.updatedAt,
        deletedAt: restoredUser.deletedAt ? restoredUser.deletedAt.toISOString() : null,
      },
    });
  } catch (error) {
    console.error('Restore user error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
