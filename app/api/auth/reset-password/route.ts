import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import User from '@/lib/db/entities/User';
import { verifyActionToken } from '@/lib/auth/actionTokens';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body?.token || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '').trim();

    if (!token || !password) {
      return NextResponse.json(
        { ok: false, error: 'token and password are required.' },
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

    if (email && email !== payload.email) {
      return NextResponse.json(
        { ok: false, error: 'This reset link does not match the provided email address.' },
        { status: 400 }
      );
    }

    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(User);
    const user = await repo.findOne({
      where: {
        id: payload.userId,
        email: payload.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Account not found for this reset link.' },
        { status: 404 }
      );
    }

    user.password = password;
    await repo.save(user);

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
