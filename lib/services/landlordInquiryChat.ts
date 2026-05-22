import { Chat, type Message, type Thread } from 'chat';
import { MemoryStateAdapter } from '@chat-adapter/state-memory';
import { createAdminClient } from '@/lib/supabase/admin';
import { createConfiguredResendAdapter, createResendThread } from '@/lib/services/emailChatConfig';

const DEFAULT_FROM_NAME = 'Spacedey Partnerships';
let landlordResendAdapter: ReturnType<typeof createConfiguredResendAdapter> | null = null;

type LandlordTriageContext = {
  inquiryId: string;
  firstName: string;
  email: string;
  streetAddress: string;
  region: string | null;
  squareFootage: string | null;
  details: string | null;
};

function createLandlordIntroMessage(context: LandlordTriageContext) {
  const locationLabel = [context.streetAddress, context.region].filter(Boolean).join(', ');
  const sizeLabel = context.squareFootage || 'the available square footage';
  const note = context.details
    ? `We also noted: "${context.details}".`
    : 'If there is anything important about access, ceiling height, or site readiness, just reply here.';

  return {
    card: {
      type: 'card' as const,
      title: 'Your landlord enquiry is in review',
      children: [
        {
          type: 'text' as const,
          content: `Hi ${context.firstName},`,
        },
        {
          type: 'text' as const,
          content: `Thanks for reaching out about your property at ${locationLabel}. We have logged your enquiry for the Spacedey partnerships team and started a review for ${sizeLabel}.`,
        },
        {
          type: 'divider' as const,
        },
        {
          type: 'text' as const,
          content: note,
        },
        {
          type: 'text' as const,
          content: 'To help us qualify the space faster, reply with any of the following you already have:',
        },
        {
          type: 'text' as const,
          content: '1. The exact city or area and property type',
        },
        {
          type: 'text' as const,
          content: '2. When the space can be made available',
        },
        {
          type: 'text' as const,
          content: '3. Loading access, power, and security details',
        },
        {
          type: 'text' as const,
          content: '4. The best number and time for a callback',
        },
        {
          type: 'divider' as const,
        },
        {
          type: 'text' as const,
          content: 'A member of our team will follow up after review.',
        },
      ],
    },
  };
}

function createFollowUpMessage(firstName: string) {
  return {
    markdown: [
      `Thanks ${firstName},`,
      '',
      'We have attached your reply to the enquiry and flagged it for the partnerships team.',
      '',
      'If you have photos, floor plans, or a preferred call window, you can keep replying in this thread and we will include them in the review.',
      '',
      'A human team member will take it from here.',
    ].join('\n'),
  };
}

let landlordInquiryChat: Chat | null = null;

function getLandlordInquiryChat(): Chat {
  if (landlordInquiryChat) {
    return landlordInquiryChat;
  }

  const resend = getLandlordResendAdapter();

  const chat = new Chat({
    userName: 'landlord-triage',
    adapters: { resend },
    state: new MemoryStateAdapter(),
  });

  const syncInboundReply = async (threadId: string, replyText: string) => {
    const supabase = createAdminClient();
    const { data: inquiry } = await supabase
      .from('landlord_inquiries')
      .select('*')
      .eq('chatThreadId', threadId)
      .maybeSingle();

    if (!inquiry) {
      return null;
    }

    const now = new Date().toISOString();
    const status = inquiry.botReplyCount > 1 ? 'triaging' : 'responded';

    await supabase
      .from('landlord_inquiries')
      .update({
        lastInboundMessage: replyText || null,
        lastInboundAt: now,
        status,
      })
      .eq('id', inquiry.id);

    return { ...inquiry, status };
  };

  const handleIncomingMessage = async (
    thread: Thread,
    message: Message
  ) => {
    const inquiry = await syncInboundReply(thread.id, String(message.text || '').trim());

    if (!inquiry) {
      return;
    }

    if (inquiry.botReplyCount > 1) {
      return;
    }

    await thread.post({
      ...createFollowUpMessage(inquiry.firstName),
      fallbackText:
        'Thanks for the extra details. We have flagged your landlord enquiry for a human follow-up.',
    });

    const supabase = createAdminClient();
    await supabase
      .from('landlord_inquiries')
      .update({
        botReplyCount: inquiry.botReplyCount + 1,
        lastOutboundAt: new Date().toISOString(),
        status: 'triaging',
      })
      .eq('id', inquiry.id);
  };

  chat.onNewMention(async (thread, message) => {
    await thread.subscribe();
    await handleIncomingMessage(thread, message);
  });

  chat.onSubscribedMessage(async (thread, message) => {
    await handleIncomingMessage(thread, message);
  });

  landlordInquiryChat = chat;
  return chat;
}

function getLandlordResendAdapter() {
  if (landlordResendAdapter) {
    return landlordResendAdapter;
  }

  landlordResendAdapter = createConfiguredResendAdapter({
    fallbackName: DEFAULT_FROM_NAME,
  });

  return landlordResendAdapter;
}

export async function sendLandlordInquiryIntroEmail(context: LandlordTriageContext) {
  const chat = getLandlordInquiryChat();
  await chat.initialize();
  const resend = getLandlordResendAdapter();
  const threadId = await resend.openDM(context.email);
  const thread = createResendThread(chat, resend, threadId);

  await thread.subscribe();
  await thread.post({
    ...createLandlordIntroMessage(context),
    fallbackText:
      `Hi ${context.firstName}, thanks for reaching out about your property. Reply with the location details, availability, and callback window so the Spacedey partnerships team can review it.`,
  });

  return thread.id;
}

export async function handleLandlordInquiryWebhook(request: Request) {
  const chat = getLandlordInquiryChat();
  return chat.webhooks.resend(request);
}

export function isLandlordInquiryChatConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}
