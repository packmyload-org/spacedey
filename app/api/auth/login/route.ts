import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongo';
import User from '@/lib/db/models/User';
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

    await connectToDatabase();

    const user = await User.findOne({ email }).select('+password');

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

    const accessToken = generateToken(user._id.toString());

    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
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
