import { NextResponse } from 'next/server';
import { appendSupportConversationMessage } from '@/lib/services/supportConversationService';

type SupportMessageRequest = {
  message?: string;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json().catch(() => null)) as SupportMessageRequest | null;
    const message = String(body?.message || '').trim();

    if (!message) {
      return NextResponse.json(
        { ok: false, error: 'Message is required.' },
        { status: 400 }
      );
    }

    const conversation = await appendSupportConversationMessage({
      conversationId: id,
      message,
    });

    return NextResponse.json({ ok: true, conversation });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
