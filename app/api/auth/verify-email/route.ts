import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import User from '@/lib/db/entities/User';
import { verifyActionToken } from '@/lib/auth/actionTokens';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body?.token || '').trim();

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'Verification token is required.' },
        { status: 400 }
      );
    }

    const payload = verifyActionToken(token, 'email_verification');

    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'This verification link is invalid or has expired.' },
        { status: 400 }
      );
    }

    const dataSource = await connectTypeORM();
    const repo = dataSource.getRepository(User);
    const user = await repo.findOne({
      where: {
        id: payload.userId,
        email: payload.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Account not found for this verification link.' },
        { status: 404 }
      );
    }

    const alreadyVerified = Boolean(user.emailVerifiedAt);

    if (!alreadyVerified) {
      user.emailVerifiedAt = new Date();
      await repo.save(user);
    }

    return NextResponse.json({
      ok: true,
      message: alreadyVerified ? 'Email already verified.' : 'Email verified successfully.',
      alreadyVerified,
    });
  } catch (error) {
    console.error('Verify email error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
