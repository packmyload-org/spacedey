import { NextResponse } from 'next/server';
import { authenticateUser, StoreganiseError } from '@/lib/integration/storeganise';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim();
    const password = String(body?.password || '').trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'email and password are required.' },
        { status: 400 }
      );
    }

    const authResponse = await authenticateUser(email, password);
    return NextResponse.json(authResponse);
  } catch (error) {
    if (error instanceof StoreganiseError) {
      return NextResponse.json(
        { error: error.message, data: error.data },
        { status: error.status }
      );
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
