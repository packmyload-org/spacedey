import { createResendAdapter } from '@resend/chat-sdk-adapter';
import type { Thread } from 'chat';
import type { Chat } from 'chat';

const FALLBACK_FROM_EMAIL = 'onboarding@resend.dev';

export function parseEmailAddress(value: string | undefined): string {
  if (!value) {
    return FALLBACK_FROM_EMAIL;
  }

  const match = value.match(/<([^>]+)>/);
  return (match?.[1] || value).trim();
}

export function parseFromName(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const match = value.match(/^\s*"?([^"<]+?)"?\s*</);
  return match?.[1]?.trim();
}

export function createConfiguredResendAdapter(args: {
  fallbackName: string;
}) {
  return createResendAdapter({
    fromAddress: parseEmailAddress(process.env.RESEND_FROM_EMAIL),
    fromName:
      parseFromName(process.env.RESEND_FROM_EMAIL) || args.fallbackName,
  });
}

export function createResendThread(
  chat: Chat,
  resend: ReturnType<typeof createConfiguredResendAdapter>,
  threadId: string
): Thread {
  return (
    chat as unknown as {
      createThread: (
        adapter: ReturnType<typeof createConfiguredResendAdapter>,
        id: string,
        state: Record<string, never>,
        isSubscribedContext: boolean
      ) => Thread;
    }
  ).createThread(resend, threadId, {}, false);
}
