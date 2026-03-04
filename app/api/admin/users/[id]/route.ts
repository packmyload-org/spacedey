import { NextResponse, NextRequest } from 'next/server';
import { connectTypeORM, AppDataSource } from '@/lib/db';
import User from '@/lib/db/entities/User';
import { requireAdmin } from '@/lib/auth/admin';
import { UserRole } from '@/lib/types/roles';

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
    // Basic UUID validation
    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    await connectTypeORM();
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { id } });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userResponse = {
      id: user.id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ ok: true, user: userResponse });
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
    const { firstName, lastName, email, role, phone } = body;

    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { ok: false, error: `Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}` },
        { status: 400 }
      );
    }

    await connectTypeORM();
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { id } });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if new email already exists
    if (email && email !== user.email) {
      const existingUser = await repo.findOne({ where: { email: email.toLowerCase() } });
      if (existingUser) {
        return NextResponse.json(
          { ok: false, error: 'Email already in use' },
          { status: 409 }
        );
      }
      user.email = email.toLowerCase();
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    await repo.save(user);

    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ ok: true, user: userResponse });
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
      return NextResponse.json(
        { ok: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    await connectTypeORM();
    const repo = AppDataSource.getRepository(User);

    // Prevent deleting the admin user (optional, adjust as needed)
    const user = await repo.findOne({ where: { id } });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent self-deletion
    if (user.id === adminCheck.userId) {
      return NextResponse.json(
        { ok: false, error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await repo.remove(user);

    return NextResponse.json({
      ok: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
