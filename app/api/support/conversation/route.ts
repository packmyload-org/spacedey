import { NextResponse } from 'next/server';
import { startSupportConversation } from '@/lib/services/supportConversationService';
import { EMAIL_PATTERN } from '@/lib/types/constants';
import { normalizeEmail } from '@/lib/utils/email';

type SupportConversationRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  topic?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as SupportConversationRequest | null;
    const firstName = String(body?.firstName || '').trim();
    const lastName = String(body?.lastName || '').trim();
    const email = normalizeEmail(body?.email || '');
    const phone = String(body?.phone || '').trim();
    const topic = String(body?.topic || '').trim();
    const message = String(body?.message || '').trim();

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { ok: false, error: 'First name, email, and message are required.' },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const conversation = await startSupportConversation({
      firstName,
      lastName: lastName || null,
      email,
      phone: phone || null,
      topic: topic || null,
      message,
    });

    return NextResponse.json({
      ok: true,
      conversation,
      message: 'Spacey started your support conversation.',
    });
  } catch (error: unknown) {
    console.error('API Route /api/support/conversation Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
