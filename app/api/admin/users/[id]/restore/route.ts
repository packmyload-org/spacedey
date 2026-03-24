import { NextRequest, NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import User from '@/lib/db/entities/User';
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

    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(User);
    const user = await repo.findOne({ where: { id }, withDeleted: true });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.deletedAt) {
      return NextResponse.json(
        { ok: false, error: 'User is already active.' },
        { status: 400 }
      );
    }

    await repo.restore(user.id);

    const restoredUser = await repo.findOne({ where: { id } });

    return NextResponse.json({
      ok: true,
      message: 'User restored successfully',
      user: restoredUser
        ? {
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
          }
        : null,
    });
  } catch (error) {
    console.error('Restore user error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
