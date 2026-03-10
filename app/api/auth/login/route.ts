import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import User from '@/lib/db/entities/User';
import { generateToken } from '@/lib/auth/jwt';
import { env } from '@/config/env';

const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30;
const SESSION_TOKEN_EXPIRES_IN = '1d';
const REMEMBER_ME_TOKEN_EXPIRES_IN = '30d';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '').trim();
    const rememberMe = body?.rememberMe === true;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(User);

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

    const accessToken = generateToken(
      user.id,
      rememberMe ? REMEMBER_ME_TOKEN_EXPIRES_IN : SESSION_TOKEN_EXPIRES_IN
    );

    const userResponse = {
      id: user.id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    };

    const response = NextResponse.json({
      ok: true,
      accessToken,
      user: userResponse,
    });

    response.cookies.set({
      name: 'auth-token',
      value: accessToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: env.app.isProduction,
      path: '/',
      ...(rememberMe ? { maxAge: REMEMBER_ME_MAX_AGE } : {}),
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
