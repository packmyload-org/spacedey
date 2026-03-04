import { NextResponse } from 'next/server';
import { connectTypeORM, AppDataSource } from '@/lib/db/typeorm';
import User from '@/lib/db/entities/User';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = String(body?.firstName || '').trim();
    const lastName = String(body?.lastName || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '').trim();
    const recaptchaToken = String(body?.recaptchaResponse || '').trim();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { ok: false, error: 'firstName, lastName, email, and password are required.' },
        { status: 400 }
      );
    }

    await connectTypeORM();
    const repo = AppDataSource.getRepository(User);

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
    } as any);

    await repo.save(newUser);

    const accessToken = generateToken(newUser.id);

    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      role: newUser.role,
    };

    return NextResponse.json(
      {
        ok: true,
        accessToken,
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
