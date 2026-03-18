import { NextResponse, NextRequest } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import User from '@/lib/db/entities/User';
import { requireAdmin } from '@/lib/auth/admin';
import { UserRole } from '@/lib/types/roles';
import { normalizeEmail } from '@/lib/utils/email';
import { sendSignupVerificationEmail } from '@/lib/email/resend';

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

    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(User);
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
      emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : null,
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
    const firstName = typeof body?.firstName === 'string' ? body.firstName.trim() : undefined;
    const lastName = typeof body?.lastName === 'string' ? body.lastName.trim() : undefined;
    const role = body?.role;
    const email = normalizeEmail(body?.email || '');

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

    if (typeof body?.password !== 'undefined') {
      return NextResponse.json(
        { ok: false, error: 'Password updates are not allowed from this screen.' },
        { status: 400 }
      );
    }

    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(User);
    const user = await repo.findOne({ where: { id } });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.id === adminCheck.userId && role === UserRole.USER) {
      return NextResponse.json(
        { ok: false, error: 'You cannot remove your own admin access.' },
        { status: 400 }
      );
    }

    let emailChanged = false;

    // Check if email is being changed and if new email already exists
    if (email && email !== user.email) {
      const existingUser = await repo.findOne({ where: { email } });
      if (existingUser) {
        return NextResponse.json(
          { ok: false, error: 'Email already in use' },
          { status: 409 }
        );
      }
      user.email = email;
      user.emailVerifiedAt = null;
      emailChanged = true;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role) user.role = role;

    await repo.save(user);

    let verificationEmailSent = false;

    if (emailChanged) {
      try {
        verificationEmailSent = await sendSignupVerificationEmail({
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          appUrl: new URL(request.url).origin,
        });
      } catch (mailError) {
        console.error('Admin update user verification email error:', mailError);
      }
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      ok: true,
      user: userResponse,
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
      return NextResponse.json(
        { ok: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(User);

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
