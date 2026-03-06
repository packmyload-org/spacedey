import { NextResponse, NextRequest } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import User from '@/lib/db/entities/User';
import { requireAdmin } from '@/lib/auth/admin';
import { UserRole } from '@/lib/types/roles';

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(User);
    const users = await repo.find();

    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json({
      ok: true,
      users: formattedUsers,
      total: formattedUsers.length,
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
    const { firstName, lastName, email, password, role } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { ok: false, error: 'firstName, lastName, email, and password are required.' },
        { status: 400 }
      );
    }

    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { ok: false, error: `Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}` },
        { status: 400 }
      );
    }

    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(User);

    const existingUser = await repo.findOne({ where: { email: email.toLowerCase() } });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: 'User with this email already exists.' },
        { status: 409 }
      );
    }
    const newUser = repo.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: role || UserRole.USER,
    } as Partial<User>);

    await repo.save(newUser);

    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return NextResponse.json(
      { ok: true, user: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
