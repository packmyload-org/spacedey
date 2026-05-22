import { Chat, type Message, type Thread } from 'chat';
import { MemoryStateAdapter } from '@chat-adapter/state-memory';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureInAppConversationSchema } from '@/lib/db/ensureInAppConversationSchema';
import { createConfiguredResendAdapter, createResendThread } from '@/lib/services/emailChatConfig';
import {
  DEFAULT_SUPPORT_EMAIL,
  DEFAULT_SUPPORT_HOURS,
  DEFAULT_SUPPORT_PHONE,
} from '@/lib/types/constants';

const DEFAULT_FROM_NAME = 'Spacedey Support';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || DEFAULT_SUPPORT_EMAIL;
const SUPPORT_PHONE = process.env.SUPPORT_PHONE || DEFAULT_SUPPORT_PHONE;
const SUPPORT_HOURS = process.env.SUPPORT_HOURS || DEFAULT_SUPPORT_HOURS;

let supportEmailChat: Chat | null = null;
let supportResendAdapter: ReturnType<typeof createConfiguredResendAdapter> | null = null;

export type SupportConversationContext = {
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  topic?: string | null;
  message: string;
};

function createSupportIntroMessage(args: SupportConversationContext) {
  const fullName = [args.firstName, args.lastName].filter(Boolean).join(' ').trim();
  const topicLine = args.topic
    ? `Topic: ${args.topic}`
    : 'Topic: General support';
  const phoneLine = args.phone
    ? `Phone: ${args.phone}`
    : 'Phone: Not provided';

  return {
    card: {
      type: 'card' as const,
      title: 'Your Spacedey support ticket is open',
      children: [
        {
          type: 'text' as const,
          content: `Hi ${args.firstName},`,
        },
        {
          type: 'text' as const,
          content:
            'Spacey has opened a support thread for you and shared your note with the Spacedey team.',
        },
        {
          type: 'divider' as const,
        },
        {
          type: 'text' as const,
          content: 'Here is what we captured:',
        },
        {
          type: 'text' as const,
          content: `Name: ${fullName || args.email}`,
        },
        {
          type: 'text' as const,
          content: `Email: ${args.email}`,
        },
        {
          type: 'text' as const,
          content: phoneLine,
        },
        {
          type: 'text' as const,
          content: topicLine,
        },
        {
          type: 'text' as const,
          content: `Message: "${args.message}"`,
        },
        {
          type: 'divider' as const,
        },
        {
          type: 'text' as const,
          content:
            'Reply to this email with any extra detail, screenshots, booking email, location, or invoice number and we will keep everything in one thread.',
        },
        {
          type: 'link' as const,
          label: 'Email support',
          url: `mailto:${SUPPORT_EMAIL}`,
        },
        {
          type: 'text' as const,
          content: `Support hours: ${SUPPORT_HOURS}`,
        },
        {
          type: 'text' as const,
          content: `Urgent help: ${SUPPORT_PHONE}`,
        },
      ],
    },
  };
}

function createSupportReply(args: { fullName: string; includeDetailsPrompt: boolean }) {
  const greetingName = args.fullName || 'there';

  return {
    markdown: [
      `Hi ${greetingName},`,
      '',
      'Thanks for contacting Spacedey support. We have received your message and added it to the support queue.',
      '',
      args.includeDetailsPrompt
        ? 'If you have not already included them, reply with your booking email, location, invoice number, and a short description of the issue so we can route this faster.'
        : 'We have your latest reply and kept it attached to the same support thread for the team.',
      '',
      `Support email: ${SUPPORT_EMAIL}.`,
      `Support hours: ${SUPPORT_HOURS}.`,
      `Urgent help: ${SUPPORT_PHONE}.`,
    ].join('\n'),
  };
}

function getSupportEmailChat() {
  if (supportEmailChat) {
    return supportEmailChat;
  }

  const resend = getSupportResendAdapter();

  const chat = new Chat({
    userName: 'support-email',
    adapters: { resend },
    state: new MemoryStateAdapter(),
  });

  const handleInboundMessage = async (thread: Thread, message: Message) => {
    await ensureInAppConversationSchema();
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('support_conversations')
      .select('*')
      .eq('threadId', thread.id)
      .maybeSingle();

    const inboundMessage = String(message.text || '').trim() || null;
    const now = new Date().toISOString();

    let conversation = existing;

    if (!conversation) {
      const { data: created, error } = await supabase
        .from('support_conversations')
        .insert({
          threadId: thread.id,
          email: message.author.userId,
          fullName: message.author.fullName || null,
          status: 'new',
          firstMessage: inboundMessage,
          lastInboundMessage: inboundMessage,
          lastInboundAt: now,
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      conversation = created;
    } else {
      await supabase
        .from('support_conversations')
        .update({
          lastInboundMessage: inboundMessage,
          lastInboundAt: now,
        })
        .eq('id', conversation.id);
    }

    const includeDetailsPrompt = conversation.botReplyCount === 0;
    if (!includeDetailsPrompt && conversation.botReplyCount > 1) {
      await supabase
        .from('support_conversations')
        .update({ status: 'triaging' })
        .eq('id', conversation.id);
      return;
    }

    await thread.subscribe();
    await thread.post({
      ...createSupportReply({
        fullName: conversation.fullName || '',
        includeDetailsPrompt,
      }),
      fallbackText:
        includeDetailsPrompt
          ? 'Thanks for contacting Spacedey support. Reply with your booking email, location, invoice number, and issue details so we can route it faster.'
          : 'Thanks. We have added your latest support reply to the ticket.',
    });

    await supabase
      .from('support_conversations')
      .update({
        botReplyCount: conversation.botReplyCount + 1,
        status: includeDetailsPrompt ? 'acknowledged' : 'triaging',
        lastOutboundAt: now,
      })
      .eq('id', conversation.id);
  };

  chat.onNewMention(async (thread, message) => {
    await handleInboundMessage(thread, message);
  });

  chat.onSubscribedMessage(async (thread, message) => {
    await handleInboundMessage(thread, message);
  });

  supportEmailChat = chat;
  return chat;
}

function getSupportResendAdapter() {
  if (supportResendAdapter) {
    return supportResendAdapter;
  }

  supportResendAdapter = createConfiguredResendAdapter({
    fallbackName: DEFAULT_FROM_NAME,
  });

  return supportResendAdapter;
}

export function isSupportEmailChatConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function startSupportConversation(context: SupportConversationContext) {
  const chat = getSupportEmailChat();
  await chat.initialize();
  const resend = getSupportResendAdapter();
  const threadId = await resend.openDM(context.email);
  const thread = createResendThread(chat, resend, threadId);

  await thread.subscribe();
  await thread.post({
    ...createSupportIntroMessage(context),
    fallbackText:
      `Hi ${context.firstName}, Spacey has opened your Spacedey support thread. Reply with any extra detail, booking email, location, or invoice number so the team can help faster.`,
  });

  await ensureInAppConversationSchema();
  const supabase = createAdminClient();
  const fullName = [context.firstName, context.lastName].filter(Boolean).join(' ').trim();
  const now = new Date().toISOString();
  const { data: existingConversation } = await supabase
    .from('support_conversations')
    .select('*')
    .eq('threadId', thread.id)
    .maybeSingle();

  if (existingConversation) {
    await supabase
      .from('support_conversations')
      .update({
        email: context.email,
        fullName: fullName || existingConversation.fullName,
        firstMessage: context.message,
        status: 'acknowledged',
        botReplyCount: Math.max(existingConversation.botReplyCount, 1),
        lastOutboundAt: now,
      })
      .eq('id', existingConversation.id);
    return thread.id;
  }

  await supabase.from('support_conversations').insert({
    threadId: thread.id,
    email: context.email,
    fullName: fullName || null,
    status: 'acknowledged',
    firstMessage: context.message,
    botReplyCount: 1,
    lastOutboundAt: now,
  });

  return thread.id;
}

export async function handleSupportEmailWebhook(request: Request) {
  const chat = getSupportEmailChat();
  return chat.webhooks.resend(request);
}
