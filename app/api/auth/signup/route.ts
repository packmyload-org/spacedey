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
    const firstName = String(body?.firstName || '').trim();
    const lastName = String(body?.lastName || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '').trim();
    const rememberMe = body?.rememberMe === true;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { ok: false, error: 'firstName, lastName, email, and password are required.' },
        { status: 400 }
      );
    }

    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await repo.findOne({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: 'User with this email already exists.' },
        { status: 409 }
      );
    }
    // Create new user
    const newUser = repo.create({
      firstName,
      lastName,
      email,
      password,
      role: 'user',
    } as Partial<User>);

    await repo.save(newUser);

    const accessToken = generateToken(
      String(newUser.id),
      rememberMe ? REMEMBER_ME_TOKEN_EXPIRES_IN : SESSION_TOKEN_EXPIRES_IN
    );

    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      role: newUser.role,
    };

    const response = NextResponse.json(
      {
        ok: true,
        accessToken,
        user: userResponse,
      },
      { status: 201 }
    );

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
    console.error('Signup error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
