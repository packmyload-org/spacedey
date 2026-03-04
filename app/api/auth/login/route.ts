import { NextResponse } from 'next/server';
import { connectTypeORM, AppDataSource } from '@/lib/db/typeorm';
import User from '@/lib/db/entities/User';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '').trim();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    await connectTypeORM();
    const repo = AppDataSource.getRepository(User);

    const user = await repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const accessToken = generateToken(user.id);

    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    };

    return NextResponse.json({
      ok: true,
      accessToken,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
